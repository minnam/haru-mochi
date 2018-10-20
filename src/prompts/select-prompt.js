const Prompt = require('./prompt')
const CMD = require('../common/cmd')
const Color = require('../common/color')

class SelectPrompt extends Prompt {
  constructor (props, items) {
    super(props)
    this.isRaw = true
    this.items = items
    this.color = new Color()
  }

  handleKeypress (str, key) {
    switch (key.name) {
    case 'up':
      if (this.index - 1 === -1) {
        this.index = this.items.length - 1
      } else {
        this.index = this.index - 1
      }

      CMD.clear(this.items.length)
      this.draw()
      break
    case 'down':
      this.index = this.index + 1
      this.index = this.index % this.items.length

      CMD.clear(this.items.length)
      this.draw()
      break
    case 'return':
      CMD.clear(this.items.length + 1)
      this.draw()
      this.proceed()
      break
    default:
      CMD.clear(this.items.length)
      this.draw()
    }
  }

  draw () {
    this.prompt()

    if(this.items) {
      this.items.map((type, key) => {
        if (key === this.index) {
          CMD.write(`${this.color.cyan('●')} ${type.name}`)
        } else {
          CMD.write(`${this.color.cyan('○')} ${type.name}`)
        }
      })
    }
  }
}

module.exports = SelectPrompt