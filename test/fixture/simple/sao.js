module.exports = {
  prompts: {
    test: {
      message: 'Add unit test?',
      type: 'confirm'
    }
  },
  filters: {
    'test.js': 'test'
  },
  move: {
    'gitignore': '.gitignore'
  }
}
