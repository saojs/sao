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
    this.showCompleteTips()
  }
}
