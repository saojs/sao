import { GeneratorsListStore } from '../utils/generators-list-store'
import { NpmGenerator, RepoGenerator } from '../parse-generator'
import { printGenerators } from './utils'

export const list = () => (): void => {
  const listStore = new GeneratorsListStore()
  const generators = listStore.store.filter((v) => v.type !== 'local') as Array<
    NpmGenerator | RepoGenerator
  >
  printGenerators(generators)
}
