module.exports = class SAOError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}
