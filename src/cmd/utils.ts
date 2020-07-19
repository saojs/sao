import Table from 'cli-table3'
import { RepoGenerator, NpmGenerator } from '../parse-generator'
import { generatorList } from '../utils/generator-list'

export function getRepoGeneratorName(g: RepoGenerator): string {
  return `${g.prefix === 'github' ? '' : `${g.prefix}:`}${g.user}/${g.repo}`
}

export function getNpmGeneratorName(g: NpmGenerator): string {
  return g.name.replace('sao-', '')
}

export function printGenerators(): void {
  const table = new Table({
    head: ['Name', 'Versions'],
  })

  for (const [name, generators] of generatorList.groupedGenerators) {
    table.push([name, generators.map((g) => `${g.version}`).join(', ')])
  }

  console.log(table.toString())
}
