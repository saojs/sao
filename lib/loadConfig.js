const path = require('path')
const JoyCon = require('joycon').default

const joycon = new JoyCon({
  files: ['saofile.js', 'saofile.json']
})

module.exports = cwd =>
  joycon.load({
    cwd,
    stopDir: path.dirname(cwd)
  })

module.exports.hasConfig = cwd => {
  return joycon.resolve({
    cwd,
    stopDir: path.dirname(cwd)
  })
}
