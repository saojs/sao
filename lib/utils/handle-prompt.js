'use strict'
const path = require('path')
const promptStore = require('./prompt-store')
const evaluate = require('./eval')

module.exports = function({ targetPath, store } = {}) {
  let gitUser

  return prompt => {
    // `role` will be removed in the future
    if (prompt.role === 'folder:name' || prompt.default === ':folderName:') {
      prompt.default = path.basename(path.resolve(process.cwd(), targetPath))
    }
    if (prompt.role === 'git:name' || prompt.default === ':gitUser:') {
      gitUser = gitUser || require('./git-user')()
      prompt.default = gitUser.username || gitUser.name
    }
    if (prompt.role === 'git:email' || prompt.default === ':gitEmail:') {
      gitUser = gitUser || require('./git-user')()
      prompt.default = gitUser.email
    }

    if (prompt.store && store && !store.skipStored) {
      const stored = promptStore.get(`${store.key}.${prompt.name}`)
      if (stored !== undefined) {
        prompt.default = stored
      }
    }

    // allow `when` to be a string
    if (typeof prompt.when === 'string') {
      const exp = prompt.when
      prompt.when = answers => evaluate(exp, answers)
    }

    return prompt
  }
}
