import { CAC } from 'cac'
import textTable from 'text-table'
import { Options, SAO } from '..'
import { handleError } from '../error'
import { printGenerators, getRepoGeneratorName } from './utils'

export const main = (cli: CAC) => async (
  generator: string,
  outDir: string
): Promise<void> => {
  const options: Options = {
    generator,
    outDir: outDir || '.',
    updateCheck: true,
    answers: cli.options.yes ? true : cli.options.answers,
    ...cli.options,
  }
  try {
    const sao = new SAO(options)
    const g = sao.parsedGenerator
    if (cli.options.version) {
      const generators = sao.generatorsListStore.findGenerators(g)
      printGenerators(generators)
    } else if (cli.options.help) {
      const { config } = await sao.getGenerator()
      const prompts =
        typeof config.prompts === 'function'
          ? await config.prompts.call(sao, sao)
          : config.prompts
      const answerFlags =
        prompts &&
        textTable(
          prompts.map((prompt) => {
            return [
              `  --answers.${prompt.name}${
                prompt.type === 'confirm' ? '' : ` <value>`
              }`,
              `${prompt.message}`,
            ]
          })
        )
      cli.globalCommand.helpCallback = (
        sections
      ): Array<{ title?: string; body: string }> => {
        sections = sections
          .map((section) => {
            if (section.title === 'Usage') {
              section.body = section.body.replace(
                '<generator>',
                g.type === 'local'
                  ? g.path
                  : g.type === 'npm'
                  ? g.name.replace('sao-', '')
                  : getRepoGeneratorName(g)
              )
            }
            if (section.title === 'Options') {
              section.title = 'Shared Options'
              section.body = section.body.replace(
                /^\s+--answers\.\*[^\n]+\n/m,
                ''
              )
            }
            return section
          })
          .filter((section) => {
            return (
              section.title !== 'Commands' &&
              section.title !==
                'For more info, run any command with the `--help` flag'
            )
          })
        if (answerFlags) {
          sections.push({
            title: 'Generator Options',
            body: answerFlags,
          })
        }
        sections.push({
          title: `Tips`,
          body: `  Prefix an option with '--no-' to set the value to 'false'.\n  e.g. --no-answers.unitTest`,
        })
        return sections
      }
      cli.outputHelp()
    } else {
      await sao.run()
    }
  } catch (error) {
    handleError(error)
  }
}
