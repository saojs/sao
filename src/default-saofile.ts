import { GeneratorConfig } from './generator-config'

export const defautSaoFile: GeneratorConfig = {
  templateDir: '.',
  actions: [
    {
      type: 'add',
      files: '**',
    },
  ],
  async completed() {
    await this.gitInit()
    if (await this.hasOutputFile('package.json')) {
      await this.npmInstall()
    }
    this.showProjectTips()
  },
}
