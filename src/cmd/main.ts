import { Options, SAO, handleError } from '..'

export const main = async (generator: string, outDir: string, flags: any) => {
  const options: Options = {
    generator,
    outDir: outDir || '.',
    updateCheck: true,
    useDefaultPromptValues: flags.yes,
    ...flags,
  }
  try {
    await new SAO(options).run()
  } catch (error) {
    handleError(error)
  }
}
