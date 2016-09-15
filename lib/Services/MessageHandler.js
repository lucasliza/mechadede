import path from 'path'
import rq from 'require-all'

class MessageHandler {
  constructor (container, client) {
    this.container = container
    this.client = client
    this.logger = container.get('logger')

    this.getModules()
  }

  getModules () {
    this.modules = rq({
      dirname: path.join(process.cwd(), 'lib/Commands'),
      filter: /(.+)\.js$/
    })
    for (let module in this.modules) {
      if (this.modules.hasOwnProperty(module)) {
        for (let command in this.modules[module]) {
          if (this.modules[module].hasOwnProperty(command) &&
          typeof this.modules[module][command] === 'object') {
            delete this.modules[module][command]
          }
        }
      }
    }
    return this.modules
  }

  reloadModules () {
    let modules = this.modules
    for (let module in modules) {
      if (!modules.hasOwnProperty(module)) continue
      for (let command in modules[module]) {
        if (!modules.hasOwnProperty(module)) continue
        if (typeof modules[module][command] === 'function') {
          delete require.cache[require.resolve(
            path.join(process.cwd(), 'lib/Commands', module, command)
          )]
        }
      }
    }
    this.getModules()
  }

  handleMessage (msg) {
    if (msg.author.bot) {
      return false
    }

    this.checkModules(msg, this.modules)
  }

  checkModules (msg, modules) {
    return new Promise((res, rej) => {
      for (let module in modules) {
        if (!modules.hasOwnProperty(module)) {
          continue
        }
        let commands = modules[module]
        for (let idx in commands) {
          if (!commands.hasOwnProperty(idx)) {
            continue
          }
          let command = new commands[idx](
            this.container, msg, this.logger, this.client
          )
          try {
            command.handle()
          } catch (err) {
            this.logger.error('Error while handling command:\n', err.stack)
            rej(err)
          }
        }
        res()
      }
    })
  }
}

module.exports = MessageHandler