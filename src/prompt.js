const check = require('check-types')
const CMD  = require('./cmd')
const Color  = require('./color')
const INPUT_BLACKLIST  = require('./input-blacklist')

class Prompt {
  constructor (props) {
    this.index = 0
    this.message = props.message
    this.key = props.key
    this.validations = props.validations || []
    this.data = ''
    this.done = props.done
    CMD.interface.setPrompt('')
    this.color = new Color()
  }

  prompt (error) {
    if (error) {
      CMD.clear(1)
    }

    CMD.write(`${this.message} ${this.color.red(error) || ''}`)
    CMD.interface.prompt()
  }

  proceed () {
    let i = 0
    while (i < this.validations.length) {
      if (this.validations[i].callback(this.data)) {
        this.prompt(this.validations[i].message)
        return
      }
      i++
    }

    // this.writeNewLine()

    this.process(this.parseInput(this.data) || this.items[this.index])

    if (this.done) {
      this.done(this.getData(), this.parseInput(this.data) || this.items[this.index], this.next)
    } else {
      this.next(1) // Assigned at PromptManager.push
    }
  }

  process (data) {
    const parsedKey = this.key.split('.')
    let i = parsedKey.length - 1
    let object = null

    while(i > -1) {
      if (!object) {
        object = {}
        object[parsedKey[i]] = data
      } else {
        const temp = {...object}
        object = {}
        object[parsedKey[i]] = {
          ...temp
        }
      }
      i--
    }

    if (!this.getData()) {
      this.setData({...object})
    } else {
      this.setData(this.merge(this.getData(), object, 0))
    }
  }

  writeNewLine () {
    CMD.write('')
  }

  merge (obj1, obj2, index) {
    let mergedObject = {}
    Object.keys(obj1).map(key => {
      if (obj2[key]) {
        if (check.object(obj1[key])) {
          mergedObject[key] = this.merge(obj1[key], obj2[key], key)
        }
      } else {
        mergedObject = {
          ...obj1,
          ...obj2
        }
      }
    })
    return mergedObject
  }

  parseInput (input) {
    return input.replace(new RegExp(INPUT_BLACKLIST, 'g'), '')
  }
}

module.exports = Prompt