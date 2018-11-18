const path = require('path')
const JoyCon = require('joycon').default
const { SAO_CONFIG_FILE } = require('./env')

const joycon = new JoyCon({
  files: [
    `${SAO_CONFIG_FILE}.js`,
    `${SAO_CONFIG_FILE}.json`
  ]
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
