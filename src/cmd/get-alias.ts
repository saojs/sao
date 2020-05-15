import { store } from '../store'
import { escapeDots } from '../utils/common'

export const getAlias = async (name: string) => {
  console.log(store.get(`alias.${escapeDots(name)}`))
}
