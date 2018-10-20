const Prompt = require('./prompt')

class TextPrompt extends Prompt {
  constructor (props) {
    super(props)
    this.isRaw = false
    this.cursor = 0
    this.cursorFlag = false
  }

  handleData (input) {
    switch (input) {
    case '\b':
      if (!this.cursorFlag) {
        this.data = this.data.substring(0, this.data.length - 1)
      } else {
        const first = this.data.slice(0, this.cursor)
        const second = this.data.slice(this.cursor + 1, this.data.length)

        this.data = first + second

        if (this.cursorFlag) {
          this.cursor--
        }
      }
      break
    case '\u001b[D': // Arrow Left  
      this.cursor--
      this.cursorFlag = true
      break
    case '\u001b[C': // Arrow Right
      this.cursor++
      this.cursorFlag = true
      break
    case '\r':
      break
    default: // Normal keys
      if (!this.cursorFlag) {
        this.data += input
        this.cursor = this.data.length - 1
      } else {
        const first = this.data.slice(0, this.cursor + 1)
        const second = this.data.slice(this.cursor + 1, this.data.length)

        this.data = first + input + second

        if (this.cursorFlag) {
          this.cursor++
        }

        this.cursorFlag = false
      }
    }
  }

  handleKeypress (str, key) {
    switch (key.name) {
    case 'return':
      this.proceed()
      break
    }
  }

  draw () {
    this.prompt()
  }
}

module.exports = TextPrompt