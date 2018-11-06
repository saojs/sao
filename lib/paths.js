const os = require('os')
const path = require('path')

// Only update this when we have to clear cache
const SAO_CACHE_VERSION = 1

const downloadPath = path.join(os.homedir(), `.sao/V${SAO_CACHE_VERSION}`)
const repoPath = path.join(downloadPath, 'repos')
const packagePath = path.join(downloadPath, 'packages')

module.exports = {
  downloadPath,
  repoPath,
  packagePath
}
