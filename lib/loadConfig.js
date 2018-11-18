const path = require('path')
const JoyCon = require('joycon').default

let joycon

module.exports = (
  cwd,
  validConfigFiles = [
    'saofile.js',
    'saofile.json'
  ]
) => {
  joycon = new JoyCon({ files: validConfigFiles })

  joycon.load({
    cwd,
    stopDir: path.dirname(cwd)
  })
}

module.exports.hasConfig = cwd => {
  return joycon.resolve({
    cwd,
    stopDir: path.dirname(cwd)
  })
}
