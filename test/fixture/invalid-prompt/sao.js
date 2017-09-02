module.exports = {
  prompts: {
    name: {
      default: 'foo',
      validate(v) {
        return v === 'bar'
      }
    }
  }
}
