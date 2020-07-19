import Table from 'cli-table3'
import {
  ParsedGenerator,
  RepoGenerator,
  NpmGenerator,
} from '../parse-generator'

export function getRepoGeneratorName(g: RepoGenerator): string {
  return `${g.prefix === 'github' ? '' : `${g.prefix}:`}${g.user}/${g.repo}`
}

export function printGenerators(generators: ParsedGenerator[]): void {
  const generatorsMap: Map<
    string,
    Array<RepoGenerator | NpmGenerator>
  > = new Map()
  for (const g of generators) {
    if (g.type === 'npm') {
      const arr = generatorsMap.get(g.name) || []
      arr.push(g)
      generatorsMap.set(g.name, arr)
    } else if (g.type === 'repo') {
      const name = getRepoGeneratorName(g)
      const arr = generatorsMap.get(name) || []
      arr.push(g)
      generatorsMap.set(name, arr)
    }
  }

  const table = new Table({
    head: ['Name', 'Versions'],
  })

  for (const [name, generators] of generatorsMap) {
    table.push([name, generators.map((g) => `${g.version}`).join(', ')])
  }

  console.log(table.toString())
}
