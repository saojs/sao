import path from 'path'
import fs from 'fs'
import updateNotifier from 'update-notifier'
import {colors} from './utils/colors'
import yarnGlobal from 'yarn-global'
import { logger } from './logger'
import { ParsedGenerator } from './parse-generator'

function performSelfUpdateCheck(): void {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
  )

  const notifier = updateNotifier({ pkg })

  if (notifier.update) {
    process.on('exit', () => {
      if (!notifier.update) return
      logger.warn(
        `Your current version of SAO is out of date. The latest version is "${notifier.update.latest}", while you're on "${notifier.update.current}".`
      )
      const isPnpm = __dirname.includes('/pnpm-global/')
      const isYarn = !isPnpm && yarnGlobal.hasDependency('sao')
      logger.tip(
        `To upgrade SAO, run the following command:\n${colors.dim(
          isYarn
            ? '$ yarn global add sao'
            : `$ ${isPnpm ? 'pnpm' : 'npm'} i -g sao`
        )}`
      )
    })
  }
}

function performGeneratorUpdateCheck(
  generator: ParsedGenerator,
  showNotifier: boolean
): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require(path.join(generator.path, 'package.json'))

  const notifier = updateNotifier({ pkg })

  if (notifier.update && showNotifier) {
    process.on('exit', () => {
      if (!notifier.update) return
      logger.warn(
        `The generator you were running is out of date. The latest version is "${notifier.update.latest}", while you're on "${notifier.update.current}".`
      )

      logger.tip(
        `To run the generator with an updated version, run the following command:\n${colors.dim(
          '$ sao ' + process.argv.slice(2).join(' ') + ' --update'
        )}`
      )
    })
  }
}


export const updateCheck = ({
  generator,
  checkGenerator,
  showNotifier,
}: {
  generator: ParsedGenerator
  checkGenerator: boolean
  showNotifier: boolean
}): void => {
  performSelfUpdateCheck()
  if (checkGenerator) {
    performGeneratorUpdateCheck(generator, showNotifier)
  }
}

