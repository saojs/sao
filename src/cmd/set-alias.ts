import { cac } from 'cac'
import { store } from '../store'
import { escapeDots } from '../utils/common'
import { logger } from '../logger'

export const setAlias = (cli: ReturnType<typeof cac>) => async (
  name: string,
  value: string
): Promise<void> => {
  if (cli.options.help) {
    cli.outputHelp()
    return
  }
  store.set(`alias.${escapeDots(name)}`, value)
  logger.success(`Added alias '${name}'`)
}
