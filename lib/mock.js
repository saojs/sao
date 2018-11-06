const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const { glob } = require('majo')
const sao = require('.')

module.exports = async (
  { generator, getContext, outDir, npmClient },
  mockAnswers
) => {
  if (!(await fs.pathExists(generator))) {
    throw new Error(`Generated is not found at ${generator}`)
  }

  const api = sao({
    generator,
    outDir:
      outDir ||
      path.join(
        os.tmpdir(),
        `sao-mock-${require('crypto')
          .randomBytes(10)
          .toString('hex')}`,
        'output'
      ),
    getContext,
    npmClient,
    // Show warning and error only
    logLevel: 2,
    mock: {
      answers: mockAnswers
    }
  })

  await api.run()

  const fileList = await glob(['**', '!**/node_modules/**'], {
    cwd: api.opts.outDir,
    dot: true
  })
  const readFile = (file, encoding = 'utf8') => {
    return fs.readFile(path.resolve(api.opts.outDir, file), encoding)
  }

  return {
    fileList: fileList.sort(),
    readFile,
    answers: api.generatorContext.answers,
    api
  }
}
