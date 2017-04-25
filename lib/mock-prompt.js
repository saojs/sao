const os = require('os')
const path = require('path')
const generate = require('./generate')

module.exports = function (template, mockPromptData = {}) {
  return generate(Object.assign({}, template, {
    // It won't write files to disk
    targetPath: path.join(os.tmpdir(), `sao-${Date.now()}`),
    mockPromptData,
    write: false,
    log: false,
    skipStore: true
  }))
}
