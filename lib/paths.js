const os = require('os')
const path = require('path')
const { SAO_GLOBAL_SCOPE } = require('./env')

// Only update this when we have to clear cache
const SAO_CACHE_VERSION = 1

const paths = {}

function init(cacheDir) {
  paths.downloadPath = path.join(
    os.homedir(),
    `.${cacheDir}/V${SAO_CACHE_VERSION}`
  )
  paths.repoPath = path.join(paths.downloadPath, 'repos')
  paths.packagePath = path.join(paths.downloadPath, 'packages')
}

module.exports = paths
module.exports.init = init
