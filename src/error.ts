import { logger } from './logger'
import { spinner } from './spinner'

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
    logger.debug(error.stack)
  } else {
    logger.error(error.stack)
  }
  process.exit(1)
}
