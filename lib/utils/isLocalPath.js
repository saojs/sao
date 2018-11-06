const RE = /^[./]|(^[a-zA-Z]:)/

module.exports = v => RE.test(v)

module.exports.removePrefix = v => v.replace(RE, '')
