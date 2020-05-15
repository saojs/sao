import path from 'path'
import { GeneratorConfig } from './generator-config'

export const defautSaoFile: GeneratorConfig = {
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
