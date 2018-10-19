const validations = {
  required: {
    callback: a => a === '' || a === undefined,
    message: 'required'
  }
}
const config = {
  prompts: [
    {
      type: 'select',
      message: 'What kind of commit is this?',
      key: 'type',
      validations: null,
      defaultItem: {
        
      },
      items: [
        {
          name: 'Hello'
        },
        {
          name: 'Hello 2'
        },
        {
          name: 'Hello 3'
        },
      ]
    },
    {
      type: 'text',
      message: 'What is your first name?',
      key: 'firstName',
      validations: [validations.required],
      done: null
    },
    {
      type: 'text',
      message: 'How old are you?',
      key: 'age',
      validations: [validations.required],
      done: null
    },
    {
      type: 'text',
      message: 'How old are you?',
      key: 'age2',
      validations: [validations.required],
      done: null
    },
    {
      type: 'text',
      message: 'Write your commit message:',
      key: 'message.content',
      validations: [validations.required],
      done: (data, value, next) => {
        if(data.type.requireMessagePostfix) {
          next(1)
        } else {
          next(2)
        }
      },
    },
    {
      type: 'text',
      message: 'Write your commit postfix:',
      key: 'message.hello',
      validations: [validations.required],
      done: null,
    }
  ],
  done: (data) => {
    console.log('Done', data)
  }
}

module.exports = config