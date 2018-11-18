const os = require('os')
const path = require('path')
const { SAO_GLOBAL_SCOPE } = require('./env')

// Only update this when we have to clear cache
const SAO_CACHE_VERSION = 1

const downloadPath = path.join(
  os.homedir(),
  `.${SAO_GLOBAL_SCOPE}/V${SAO_CACHE_VERSION}`
)

const repoPath = path.join(downloadPath, 'repos')
const packagePath = path.join(downloadPath, 'packages')

module.exports = {
  downloadPath,
  repoPath,
  packagePath
}
