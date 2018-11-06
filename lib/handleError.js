const SAOError = require('./SAOError')
const logger = require('./logger')
const spinner = require('./spinner')

module.exports = error => {
  spinner.stop()
  if (error instanceof SAOError) {
    if (error.cmdOutput) {
      console.error(error.cmdOutput)
    }
    logger.error(error.message)
  } else {
    logger.error(error.stack)
  }
  process.exit(1) // eslint-disable-line unicorn/no-process-exit
}
