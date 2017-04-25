const generate = require('./generate')

module.exports = function (template, mockPromptData = {}) {
  return generate(Object.assign({}, template, {
    mockPromptData,
    write: false,
    log: false
  }))
}
