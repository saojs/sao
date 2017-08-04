module.exports = class SAOError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'SAOError'
    this.code = code
  }
}
