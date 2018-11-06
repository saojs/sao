module.exports = class SAOError extends Error {
  constructor(msg) {
    super(msg)
    this.__sao = true
  }
}
