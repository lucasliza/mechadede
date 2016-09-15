import { Client as Discord } from 'discord.js'
import rq from 'require-all'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import { EventEmitter } from 'events'
import MessageHandler from './MessageHandler'

class Loader extends EventEmitter {
  constructor (container) {
    super()

    this.container = container
    this.logger = container.get('logger')
    this.loaded = {
      clients: false,
      discord: false,
      api_keys: false
    }
    this.on('loaded', () => this.checkLoaded.bind(this))
    this.failCheck = setTimeout(this.checkLoaded.bind(this), 30000)
  }

  start () {
    this.loadDiscord()
    this.on('loaded.discord', () => {
      this.loadClients()
      this.loadAPIKeys()
    })
  }

  loadAPIKeys () {
    let keysPath = path.join(process.cwd(), 'keys')
    fs.readdir(keysPath, (err, filenames) => {
      if (err) {
        this.logger.error('Error reading keys', err)
        return
      }
      filenames.forEach(filename => {
        fs.readFile(path.join(keysPath, filename), 'utf-8', (err, content) => {
          if (err) {
            this.logger.error('Error reading file ' + filename, err)
            return
          }
          if (!filename.startsWith('.') && filename.indexOf('example') === -1) {
            this.container.setParam(
              filename.substring(0, filename.indexOf('.')), content
            )
          }
        })
      })
      this.setLoaded('api_keys')
    })
  }

  loadClients () {
    let clients = rq({
      dirname: path.join(process.cwd(), 'lib/Clients'),
      filter: /(.+)\.js$/
    })
    for (let Client in clients) {
      if (clients.hasOwnProperty(Client)) {
        let client = new clients[Client](this.container)
        this.container.clients[client.name] = client
        try {
          this.container.clients[client.name].run()
        } catch (err) {
          this.logger.error(
            `Error while running client ${client.name}:\n`, err
          )
        }
      }
    }

    this.setLoaded('clients')
  }

  loadDiscord () {
    let auth = {
      token: this.container.getParam('token')
    }

    let logger = this.logger
    let client = new Discord({
      autoReconnect: true
    })
    let handler = this.container.set(
      'handler', new MessageHandler(this.container, client)
    )

    client.on('ready', () => {
      this.setLoaded('discord')
      this.container.set('discord', client)
      let admins = this.container.getParam('admin_id')
      if (admins) {
        client.admins = []
        admins.forEach(elem => {
          client.admins.push(elem)
        })
      }
      logger.info(
        `Connecting as ${chalk.red(client.user.name)} <@${client.user.id}>`
      )
      logger.info(
        `${client.guilds.size} servers and ` +
        `${client.users.length} users in cache`
      )
      logger.info(`Prefix: '${this.container.getParam('prefix')}'`)
    })

    client.on('error', err => {
      logger.error(err)
    })
    client.on('warn', warn => {
      logger.warn(warn)
    })
    client.on('disconnect', () => logger.info(`
      ${chalk.red(client.user.name)} has been disconnected`
    ))
    if (this.debug === true) {
      client.on('debug', msg => logger.debug(msg))
    }

    client.on('message', msg => {
      handler.handleMessage(msg)
    })
    // client.on('messageUpdated', handler.updatedMessage) --> soon?

    if (auth.token) {
      client.login(auth.token)
      .catch(err => {
        logger.error('Error caught while connecting with token:\n', err)
      })
    }
  }

  setLoaded (type) {
    this.loaded[type] = true
    this.emit('loaded.' + type)

    this.emit('loaded')
  }

  checkLoaded (fail) {
    this.emit('checkLoaded')
    fail = typeof fail !== 'undefined'

    if (fail) {
      throw new Error(
        'Failed initializing. Loaded: ' + JSON.stringify(this.loaded, null, 2)
      )
    }

    this.logger.debug('Loader status:\n', {
      Ready: this.isLoaded() ? 'Yes' : 'No',
      Discord: this.loaded.discord ? 'Logged in' : 'Logging in',
      Client: this.loaded.clients ? 'Loaded clients' : 'Starting clients'
    })

    if (!this.isLoaded()) {
      return false
    }

    clearTimeout(this.failCheck)
    delete this.failCheck

    setTimeout(() => {
      this.logger.debug('Finished loading. Emitting ready event')
      this.emit('ready')
    }, 1500)
  }

  isLoaded () {
    return this.loaded.discord && this.loaded.clients
  }
}

module.exports = Loader