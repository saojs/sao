import { logger } from './logger'
import { spinner } from './spinner'
import { colors } from './utils/colors'

export class SAOError extends Error {
  sao: boolean
  cmdOutput?: string

  constructor(message: string) {
    super(message)
    this.sao = true
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(message).stack
    }
  }
}

export function handleError(error: Error | SAOError): void {
  spinner.stop()
  if (error instanceof SAOError) {
    if (error.cmdOutput) {
      console.error(error.cmdOutput)
    }
    logger.error(error.message)
    logger.debug(colors.dim(error.stack))
  } else if (error.name === 'CACError') {
    logger.error(error.message)
  } else {
    logger.error(error.stack)
  }
  process.exit(1)
}
