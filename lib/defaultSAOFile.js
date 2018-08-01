module.exports = {
  templateDir: '.',
  actions: [
    {
      type: 'add',
      files: '**',
      transform: false
    }
  ],
  completed() {
    this.showCompleteTips()
  }
}
