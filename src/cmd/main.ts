import { cac } from 'cac'
import { Options, SAO, handleError } from '..'

export const main = (cli: ReturnType<typeof cac>) => async (
  generator: string | undefined,
  outDir: string
): Promise<void> => {
  if (!generator) {
    cli.outputHelp()
    return
  }

  const options: Options = {
    generator,
    outDir: outDir || '.',
    updateCheck: true,
    answers: cli.options.yes ? true : cli.options.answers,
    ...cli.options,
  }
  try {
    const sao = new SAO(options)
    if (cli.options.help) {
      const help = await sao.getGeneratorHelp()
      console.log(help)
    } else {
      await sao.run()
    }
  } catch (error) {
    handleError(error)
  }
}
