const pipeSpawn = require('install-packages/lib/pipeSpawn')

module.exports = cwd => {
  return pipeSpawn('git', ['init'], {
    cwd
  })
}
