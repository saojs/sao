module.exports = {
  prompts: {
    name: {
      message: 'type name',
      default: ':folderName:'
    }
  },
  data(answers) {
    return {
      newName: `hello ${answers.name}`
    }
  }
}
