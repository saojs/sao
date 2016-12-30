'use strict'
const path = require('path')
const promptStore = require('./prompt-store')

module.exports = function ({
  targetFolder,
  template
} = {}) {
  let gitUser

  return prompt => {
    if (prompt.role === 'folder:name') {
      prompt.default = path.basename(path.resolve(process.cwd(), targetFolder))
    }
    if (prompt.role === 'git:name') {
      gitUser = gitUser || require('./git-user')()
      prompt.default = gitUser.name
    }
    if (prompt.role === 'git:email') {
      gitUser = gitUser || require('./git-user')()
      prompt.default = gitUser.email
    }

    if (prompt.store) {
      const stored = promptStore.get(`${template}.${prompt.name}`)
      if (stored !== undefined) {
        prompt.default = stored
      }
    }

    return prompt
  }
}
