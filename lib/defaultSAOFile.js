const path = require('path')

module.exports = {
  templateDir: '.',
  actions: [
    {
      type: 'add',
      files: '**',
      transform: false
    }
  ],
  complete() {
    this.completeTip()
  }
}
