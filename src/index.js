const fs  = require('fs')
const path  = require('path')

const MessagePrompt  = require('./message-prompt')

const config           = require('../example-config.js')
const PromptManager    = require('./prompt-manager')
const SelectPrompt     = require('./select-prompt')


// console.log(`${__dirname}/${process.argv[2]}`)

/* Main ========================================================================================= */
const start = () => {
  const pm = new PromptManager()
  let config

  try {
    if (process.argv[2]) {
      // const foo = await import(`${__dirname}/${process.argv[2]}`);
      config = require(fs.realpathSync(process.argv[2]))
    }
  } catch (e) {
    console.log(e)
  }
  
  if (config && config.prompts && config.prompts.length > 0) {
    config.prompts.map(prompt => {
      switch (prompt.type) {
        case 'text':
        pm.push(new MessagePrompt(prompt))
        break;

        case 'select':
        pm.push(
          new SelectPrompt(
            prompt,
            prompt.items.map(item => {
              return {
                ...prompt.defaultItem,
                ...item
              }
            })
          )
        )
        break;
      }
    })
  }
  pm.done((data) => {
    if (config.done) {
      config.done(data)
    }
  })
  pm.start()
    
}

start()

/* Run ========================================================================================== */
// if (!process.argv[2]) {
//   start()
// } else {
//   switch (process.argv[2]) {
//     case 'start': 
//       start()
//       break
//     case 'update':
//       const dir = './.before-push/cache'
//       const changeLogs = []
//       fs.readdirSync(dir).forEach(fileName => {
//         const filePath = `${dir}/${fileName}`
//         let commits

//         try {
//           commits = fs.readFileSync(filePath)
//           commits = JSON.parse(commits)
//         } catch (e) {
//           console.log(e)
//         }
    
//         changeLogs.push({
//           date: fileName.split('.json')[0],
//           commits
//         })
//       })

//       let md;
//       changeLogs.map(log => {
//         md = `## [${log.version}] ${log.date}\n`

//         config.commits.map(commitType => {
//           console.log(commitType)
//         })

//         // log.commits.map(commit => {
//         //   md += `### ${commit.type.name}`
//         //   console.log(commit)
//         // })
//       })      

//       break;
//   }
// }
// 
// switch (console.log(process.env.npm_config_myVar)) 