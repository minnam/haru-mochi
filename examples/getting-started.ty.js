const validations = {
  required: {
    callback: a => a === '' || a === undefined,
    message: 'required'
  },
  isNumber: {
    callback: a => isNaN(parseFloat(a)),
    message: 'must be a number'
  }
}

module.exports = {
  title: 'Getting Started',
  description: 'This is a simple example of CLI created with termiyou. Notice how validation is handled.',
  prompts: [
    {
      type: 'text',
      message: 'What is your name?',
      key: 'name',
      validations: [validations.required]
    },
    {
      type: 'text',
      message: 'How old are you?',
      key: 'age',
      validations: [validations.required, validations.isNumber]
    },
  ],
  done: (data) => {
    console.log('Done', data)
  }
}