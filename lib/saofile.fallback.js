const path = require('path')

module.exports = {
  templateDir: '.',
  actions: [
    {
      type: 'add',
      files: '**'
    }
  ],
  async completed() {
    await this.gitInit()
    const pkgPath = path.join(this.outDir, 'package.json')
    if (await this.fs.pathExists(pkgPath)) {
      await this.npmInstall()
    }
    this.showProjectTips()
  }
}
