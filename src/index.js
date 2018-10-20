const fs  = require('fs')
const path  = require('path')

const PromptManager = require('./prompt-manager')

const TextPrompt = require('./prompts/text-prompt')
const SelectPrompt = require('./prompts/select-prompt')


// console.log(`${__dirname}/${process.argv[2]}`)

/* Main ========================================================================================= */

const prompt = config => {
  const pm = new PromptManager({
    description: config.description
  })
  
  if (config && config.prompts && config.prompts.length > 0) {
    config.prompts.map(prompt => {
      switch (prompt.type) {
        case 'text':
        pm.push(new TextPrompt(prompt))
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

const start = () => {
  let config

  if (process.argv[2]) {
    const path = fs.realpathSync(process.argv[2])
    // const foo = await import(`${__dirname}/${process.argv[2]}`);
    if (fs.lstatSync(process.argv[2]).isDirectory()) {
      fs. readdir(path, (err, items) => {
        if (err) {
          return err
        }

        const tsConfigFiles = []

        items.map(item => {
          if (item.includes('.ty.')) {
            const itemConfig = require(`${path}/${item}`)
            tsConfigFiles.push({
              name: itemConfig.title,
              config: itemConfig
            })
          }
        })

        prompt({
          prompts: [
            {
              type: 'select',
              message: 'Select CLI',
              key: 'model',
              validations: null,
              defaultItem: {
                
              },
              items: tsConfigFiles
            }
          ],
          done: (data) => {
            prompt(data.model.config)
          }
        })

      })
      return 
    } else {
      config = require(fs.realpathSync(process.argv[2]))
    }

    prompt(config)
  }
    
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