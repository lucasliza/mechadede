import BaseCommand from '../../Base/BaseCommand'
var gm = require('gm').subClass({imageMagick: true});
import fs from 'fs'
import path from 'path'

const sample = [
  'discord',
  'doge',
  'haru',
  'gay',
  'fag',
  'command',
  'pictures'
]

class DogeGM extends BaseCommand {
  static get name () {
    return 'doge'
  }

  static get description () {
    return 'such doge, much wow'
  }

  randX () {
    let x = Math.floor(Math.random() * 1200)
    if (x > 1000) {
      x -= 200
    }
    return x
  }

  randY () {
    return Math.floor(Math.random() * 600) + 250
  }

  modifyArr (input) {
    if (input.length > 4) {
      let i = input.length
      while (i > 4) {
        input.splice(Math.floor(Math.random() * input.length), 1)
        i--
      }
    } else if (input.length < 4) {
      let i = input.length
      while (i < 4) {
        input.push(sample[Math.floor(Math.random() * sample.length)])
        i++
      }
    }
    return input
  }

  error (err, text) {
    text = text || ''
    this.logger.error(
      `Error occurred while uploading file from GM command 'doge' ` +
      `with text ${text}`,
      err
    )
    return this.reply(
      `Error: Unable to upload image with text ${text}`
    )
  }

  createImage (res) {
    console.log(path.join(__dirname, 'img/doge.jpg'))
    gm(path.join(__dirname, 'img/doge.jpg'))
    .font(path.join(__dirname, 'img/comicsans.ttf'), 100)
    .fill('#ff0000')
    .drawText(this.randX(), this.randY(), `such ${res[0]}`)
    .fill('#00ff00')
    .drawText(this.randX(), this.randY(), `much ${res[1]}`)
    .fill('#0000ff')
    .drawText(this.randX(), this.randY(), `many ${res[2]}`)
    .fill('#ee00ee')
    .drawText(this.randX(), this.randY(), `very ${res[3]}`)
    .write(path.join(__dirname, `img/res-${this.message.id}.png`), err => {
      if (err) {
        this.error(err, res.join(', '))
      }
      this.upload(
        path.join(__dirname, `img/res-${this.message.id}.png`), 'doge.png'
      )
      .then(() => {
        fs.unlink(path.join(__dirname, `img/res-${this.message.id}.png`))
      })
      .catch(err => {
        this.error(err, res.join(', '))
      })
    })
  }

  handle () {
    this.responds(/^doge$/i, () => {
      let input = []
      this.channel.fetchMessages({limit: 10}).then((msgs) => {
        console.log(`Received ${msgs.size} messages`)
        let res = []
        for (let msg in msgs) {
          if (typeof msgs[msg].content === 'string') {
            res = res.concat(msgs[msg].content.match(/\w+/g))
          }
        }
        input = res.filter((elem, idx, arr) => {
          return elem !== undefined && arr.indexOf(elem) === idx
        })
        return this.createImage(this.modifyArr(input))
      }).catch(this.error)
    })
  }
}

module.exports = DogeGM