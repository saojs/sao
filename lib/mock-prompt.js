const generate = require('./generate')
const { readPkg } = require('./utils')
const { getConfigFileName } = require('./utils/config')

module.exports = function(template, mockPrompts = {}) {
  if (typeof template === 'string') {
    template = { fromPath: template }
  }
  const templatePkg = readPkg(template.fromPath)
  const configFileName = getConfigFileName(null, templatePkg)
  return generate(
    Object.assign(
      {
        // It won't write files to disk
        targetPath: '/fake-path/output',
        mockPrompts,
        write: false,
        log: false
      },
      {
        configFileName
      },
      template
    )
  )
}
