'use strict'
const path = require('path')

module.exports = function ({
  targetFolder
} = {}) {
  let gitUser

  return prompt => {
    if (prompt.role === 'name') {
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
    return prompt
  }
}
