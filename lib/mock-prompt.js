const generate = require('./generate')

module.exports = function(template, mockPromptData = {}) {
  if (typeof template === 'string') {
    template = { fromPath: template }
  }
  return generate(
    Object.assign({}, template, {
      // It won't write files to disk
      targetPath: '/fake-path/output',
      mockPromptData,
      write: false,
      log: false
    })
  )
}
