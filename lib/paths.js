const os = require('os')
const path = require('path')
const pkg = require('../package.json')

const downloadPath = path.join(
  os.homedir(),
  `.sao/V${pkg.version.split('.')[0]}`
)
const repoPath = path.join(downloadPath, 'repos')
const packagePath = path.join(downloadPath, 'packages')

module.exports = {
  downloadPath,
  repoPath,
  packagePath
}
