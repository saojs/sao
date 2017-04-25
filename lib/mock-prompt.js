const generate = require('./generate')

module.exports = function (template, data) {
  return generate(Object.assign({}, template, { data }))
}
