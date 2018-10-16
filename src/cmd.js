const readline = require('readline')
const getCursorPosition = require('get-cursor-position');

const CMD = {
  interface: readline.createInterface({ input: process.stdin, output: process.stdout, historySize: 0 }),
  clearOffset: 2,
  clear: line => {
    const pos = getCursorPosition.sync();

    if (process.stdout.rows < pos.row) {
      readline.cursorTo(process.stdout, 0, process.stdout.rows - (line + CMD.clearOffset))
      // console.log(process.stdout.rows, pos.row - 5)
    } else {
      readline.cursorTo(process.stdout, 0, pos.row - (line + CMD.clearOffset))
    }

  },
  write: msg => { process.stdout.write(`${msg}\n`) }
}

module.exports = CMD