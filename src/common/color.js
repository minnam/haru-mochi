const COLORS = {
  white: '\x1B[37m',
  grey: '\x1B[90m',
  black: '\x1B[30m',
  blue: '\x1B[34m',
  cyan: '\x1B[36m',
  green: '\x1B[32m',
  magenta: '\x1B[35m',
  red: '\x1B[31m',
  yellow: '\x1B[33m'
}

class Color {
  constructor (defaultColor) {
    // Need to handle error
    this.defaultColor = COLORS[defaultColor] || COLORS.white

    for (const key in COLORS) {
      this[key] = (text) => {
        if (text) {
          return `${COLORS[key]}${text}${this.defaultColor}`
        }
      }
    }
  }
}

module.exports = Color