import { cac } from 'cac'
import { store } from '../store'
import { escapeDots } from '../utils/common'

export const getAlias = (cli: ReturnType<typeof cac>) => async (
  name: string
): Promise<void> => {
  if (cli.options.help) {
    cli.outputHelp()
    return
  }
  console.log(store.get(`alias.${escapeDots(name)}`))
}
