import { store } from '../store'
import { escapeDots } from '../utils/common'

export const getAlias = async (name: string): Promise<void> => {
  console.log(store.get(`alias.${escapeDots(name)}`))
}
