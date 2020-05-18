import { Options, SAO, handleError } from '..'

type Flags = {
  yes?: boolean
}

export const main = async (
  generator: string,
  outDir: string,
  flags: Flags
): Promise<void> => {
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
