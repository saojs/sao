import path from 'path'
import { colors, ColorType } from './utils/colors'

interface Options {
  logLevel?: number
  mock?: boolean
}

export class Logger {
  options: Required<Options>
  lines: string[]

  constructor(options?: Options) {
    this.options = Object.assign(
      {
        logLevel: 3,
        mock: false,
      },
      options
    )
    this.lines = []
  }

  setOptions(options: Options): void {
    Object.assign(this.options, options)
  }

  log(...args: any[]): void {
    if (this.options.mock) {
      this.lines.push(args.join(' '))
    } else {
      console.log(...args)
    }
  }

  // level: 4
  debug(...args: any[]): void {
    if (this.options.logLevel < 4) {
      return
    }

    this.status('magenta', 'debug', ...args)
  }

  // level: 2
  warn(...args: any[]): void {
    if (this.options.logLevel < 2) {
      return
    }
    this.log(colors.yellow('warning'), ...args)
  }

  // level: 1
  error(...args: any[]): void {
    if (this.options.logLevel < 1) {
      return
    }
    process.exitCode = process.exitCode || 1
    this.log(colors.red('error'), ...args)
  }

  // level: 3
  success(...args: any[]): void {
    this.status('green', 'success', ...args)
  }

  // level: 3
  tip(...args: any[]): void {
    this.status('blue', 'tip', ...args)
  }

  info(...args: any[]): void {
    this.status('cyan', 'info', ...args)
  }

  status(color: ColorType, label: string, ...args: any[]): void {
    if (this.options.logLevel < 3) {
      return
    }
    this.log(colors[color](label), ...args)
  }

  fileAction(color: ColorType, type: string, fp: string): void {
    if (this.options.logLevel < 3) {
      return
    }
    this.info(
      `${colors[color](type)} ${colors.green(path.relative(process.cwd(), fp))}`
    )
  }

  fileMoveAction(from: string, to: string): void {
    if (this.options.logLevel < 3) {
      return
    }
    this.info(
      `${colors.blue('Moved')} ${colors.green(
        path.relative(process.cwd(), from)
      )} ${colors.dim('->')} ${colors.green(path.relative(process.cwd(), to))}`
    )
  }
}

export const logger = new Logger()
