module.exports = {
  prompts: {
    deps: {
      name: 'deps',
      default: []
    },
    devDeps: {
      name: 'devDeps',
      default: []
    }
  },
  post({ yarnInstall, answers }) {
    yarnInstall(answers.deps)
    yarnInstall(answers.devDeps, { dev: true })
  }
}
