const CMD = require('./common/cmd')

class PromptManager {
  constructor (props) {
    this.index = 0
    this.prompts = []
    this.data = null
    this.description = props.description

    this.handleData =  (data) => {
      if (this.index !== null && this.prompts[this.index].handleData) {
        this.prompts[this.index].handleData(data)
      }
    }

    this.handleKeypress = (str, key) => {
      if (this.index !== null && this.prompts[this.index].handleKeypress) {
        this.prompts[this.index].handleKeypress(str, key)
      }
    }
  }

  getData () {
    return this.data
  }

  setData (data) {
    this.data = { ...data }
  }

  push (prompt) {
    prompt.next = this.next.bind(this)
    prompt.getData = this.getData.bind(this)
    prompt.setData = this.setData.bind(this)
    this.prompts.push(prompt)
  }

  start () {
    // console.log(intro)
    if (this.description) {
      CMD.write(this.description)
      CMD.write('')
    }

    this.draw()
  }

  draw () {
    if (this.prompts[this.index].draw) {
      this.prompts[this.index].draw()
    }

    CMD.interface.input.setEncoding('ascii')
    CMD.interface.input.addListener('data', this.handleData)
    CMD.interface.input.addListener('keypress', this.handleKeypress)
  }

  reset () {
    CMD.interface.input.removeListener('data', this.handleData)
    CMD.interface.input.removeListener('keypress', this.handleKeypress)

    this.handleData =  (data) => {
      if (this.index !== null && this.prompts[this.index].handleData) {
        this.prompts[this.index].handleData(data)
      }
    }

    this.handleKeypress = (str, key) => {
      if (this.index !== null && this.prompts[this.index].handleKeypress) {
        this.prompts[this.index].handleKeypress(str, key)
      }
    }
  }

  next (i) {
    this.reset()
    CMD.write('')

    if (this.index + i < this.prompts.length) {
      process.stdout.clearLine()
      this.index += i
      this.reset()
      this.draw()
    } else {
      // Finished prompts
      process.stdin.unref()
      process.stdout.clearLine()
      this.index = null
      this._done(this.getData())
      // process.exit(0)
    }
  }

  done (done) {
    if (typeof done === 'function') {
      this._done = done
    }
  }
}

module.exports = PromptManager