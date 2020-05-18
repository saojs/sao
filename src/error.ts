import { logger } from './logger'
import { spinner } from './spinner'

export class SAOError extends Error {
  sao: boolean
  cmdOutput?: string

  constructor(msg: string) {
    super(msg)
    this.sao = true
  }
}

export function handleError(error: Error | SAOError): void {
  spinner.stop()
  if (error instanceof SAOError) {
    if (error.cmdOutput) {
      console.error(error.cmdOutput)
    }
    logger.error(error.message)
  } else {
    logger.error(error.stack)
  }
  process.exit(1)
}
