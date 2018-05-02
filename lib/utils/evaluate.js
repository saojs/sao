module.exports = function(exp, data) {
  /* eslint-disable no-new-func */
  const fn = new Function('data', `with (data) { return ${exp} }`)
  try {
    return fn(data)
  } catch (err) {
    console.error(err.stack)
    console.error(`Error when evaluating filter condition: ${exp}`)
  }
}
