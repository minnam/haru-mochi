const CMD = require('./cmd')
const Prompt = require('./prompt')
const Color = require('./color')

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

      CMD.clear(this.items.length + 1)
      this.draw()
      break
    case 'down':
      this.index = this.index + 1
      this.index = this.index % this.items.length

      CMD.clear(this.items.length + 1)
      this.draw()
      break
    case 'return':
      this.proceed()
      break
    default:
      CMD.clear(this.items.length + 1)
      this.draw()
    }
  }

  draw () {
    this.writeNewLine()
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