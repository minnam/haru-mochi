const check = require('check-types')
const CMD  = require('../common/cmd')
const Color  = require('../common/color')
const INPUT_BLACKLIST  = require('../common/input-blacklist')

class Prompt {
  constructor (props) {
    this.index = 0
    this.message = props.message
    this.key = props.key
    this.default = props.default
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

    if (this.default) {
      CMD.write(`${this.message} ${this.color.grey(`(${this.default})`)} ${this.color.red(error) || ''}`)
    } else {
      CMD.write(`${this.message} ${this.color.red(error) || ''}`)
    }

    CMD.interface.prompt()
  }

  proceed (offset = 0) {
    let i = 0

    if (!this.data && this.default) {
      this.data = this.default
    }

    while (i < this.validations.length) {
      // console.log(this.data, this.validations[i].callback(this.data), isNaN(parseInt(this.data)))
      if (this.validations[i].callback(this.data)) {
        this.prompt(this.validations[i].message)
        // If data is not set to empty, data addons to previous data
        this.data = ''
        return
      }
      i++
    }

    this.process(this.parseInput(this.data) || this.items[this.index])

    if (this.done) {
      this.done(this.getData(), this.parseInput(this.data) || this.items[this.index], this.next)
    } else {
      this.next(1 + offset) // Assigned at PromptManager.push
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