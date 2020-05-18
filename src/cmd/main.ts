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
    useDefaultPromptValues: cli.options.yes,
    ...cli.options,
  }
  try {
    const sao = new SAO(options)
    if (cli.options.help) {
      const help = await sao.getGeneratorHelp()
      console.log(help)
    } else {
      const { generator, config } = await sao.getGenerator()
      await sao.runGenerator(generator, config)
    }
  } catch (error) {
    handleError(error)
  }
}
