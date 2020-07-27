import { existsSync, readFileSync, writeFileSync } from 'fs'
import {
  ParsedGenerator,
  NpmGenerator,
  RepoGenerator,
} from '../parse-generator'
import { GENERATORS_LIST_PATH } from '../paths'
import { logger } from '../logger'
import { getRepoGeneratorName, getNpmGeneratorName } from '../cmd/utils'

export type GroupedGenerators = Map<string, Array<NpmGenerator | RepoGenerator>>

export class GeneratorList {
  store: ParsedGenerator[]

  constructor() {
    this.store = []
    if (existsSync(GENERATORS_LIST_PATH)) {
      this.store = JSON.parse(readFileSync(GENERATORS_LIST_PATH, 'utf8'))
    }
  }

  add(generator: ParsedGenerator): void {
    let exist = false
    for (const item of this.store) {
      if (item.hash === generator.hash) {
        exist = true
      }
    }
    if (!exist) {
      this.store.push(generator)
    }
    logger.debug(`Updating ${GENERATORS_LIST_PATH}`)
    const newContent = JSON.stringify(this.store)
    writeFileSync(GENERATORS_LIST_PATH, newContent, 'utf8')
  }

  findGenerators(generator: ParsedGenerator): ParsedGenerator[] {
    return this.store.filter((item) => {
      if (generator.type === 'repo' && item.type === 'repo') {
        return (
          `${item.prefix}:${item.user}/${item.repo}` ===
          `${generator.prefix}:${generator.user}/${generator.repo}`
        )
      }
      if (generator.type === 'npm' && item.type === 'npm') {
        return generator.name === item.name
      }
      return false
    })
  }

  /**
   * Group generators by name
   */
  get groupedGenerators(): GroupedGenerators {
    const generatorsMap: GroupedGenerators = new Map()
    for (const g of this.store) {
      if (g.type === 'npm') {
        const name = getNpmGeneratorName(g)
        const arr = generatorsMap.get(name) || []
        arr.push(g)
        generatorsMap.set(g.name, arr)
      } else if (g.type === 'repo') {
        const name = getRepoGeneratorName(g)
        const arr = generatorsMap.get(name) || []
        arr.push(g)
        generatorsMap.set(name, arr)
      }
    }
    return generatorsMap
  }
}

export const generatorList = new GeneratorList()
