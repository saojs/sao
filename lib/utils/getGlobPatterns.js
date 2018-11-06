const evaluate = require('./evaluate')

module.exports = (files, context, getExcludedPatterns) => {
  return Object.keys(files).filter(pattern => {
    let condition = files[pattern]
    if (typeof condition === 'string') {
      condition = evaluate(condition, context)
    }
    return getExcludedPatterns ? !condition : condition
  })
}
