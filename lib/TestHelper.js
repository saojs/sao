module.exports = class TestHelper {
  constructor(sao) {
    this.sao = sao
  }

  async run() {
    await this.sao.generate()

    // eslint-disable-next-line no-multi-assign
    const stream = this.stream = require('majo')().source(['**', '!**/node_modules/**'], {
      baseDir: this.sao.options.outDir
    })

    await stream.process()

    return this
  }

  get fileList() {
    return this.stream.fileList
  }

  readFile(relative) {
    return this.stream.fileContents(relative)
  }

  writeFile(relative, contents) {
    this.stream.writeContents(relative, contents)
    return this
  }
}
