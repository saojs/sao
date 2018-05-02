const gitConfigPath = require('git-config-path')
const promisify = require('./promisify')

const parseGitConfig = promisify(require('parse-git-config'))

let cache

module.exports = async () => {
  if (cache) return cache

  const { user = {} } = await parseGitConfig({ cwd: '/', path: gitConfigPath('global') })

  cache = {
    user: user.username || user.name || '',
    email: user.email || ''
  }

  return cache
}
