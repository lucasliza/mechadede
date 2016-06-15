import BaseCommand from '../../Base/BaseCommand'

class BotInfo extends BaseCommand {
  static get name () {
    return 'info'
  }

  static get description () {
    return 'Shows information of the bot'
  }

  fetchBot () {
    return [
      `Running on **mechadede** v${process.env.npm_package_version || '1.2.0'}`,
      'I\'m designed by Lzia',
    ].join('\n')
  }

  handle () {
    this.responds(/^info$/i, () => {
      this.send(this.channel, this.fetchBot())
    })
  }
}

module.exports = BotInfo