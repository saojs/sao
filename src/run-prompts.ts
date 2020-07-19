import resolveFrom from 'resolve-from'
import { logger } from './logger'
import { store } from './store'
import { GeneratorConfig } from './generator-config'
import { prompt } from './utils/prompt'
import { SAO } from '.'

export const runPrompts = async (
  config: GeneratorConfig,
  context: SAO
): Promise<void> => {
  const prompts =
    typeof config.prompts === 'function'
      ? await config.prompts.call(context, context)
      : config.prompts

  if (!prompts || prompts.length === 0) {
    context.answers = {}
    return
  }

  const pkgPath = resolveFrom.silent(context.parsedGenerator.path, './package.json')
  const pkgVersion = pkgPath ? require(pkgPath).version : ''
  const STORED_ANSWERS_ID = `answers.${
    context.parsedGenerator.hash + '__npm__' + pkgVersion.replace(/\./g, '\\.')
  }`
  const storedAnswers = store.get(STORED_ANSWERS_ID) || {}

  const { mock } = context.opts
  if (!mock) {
    logger.debug('Reusing cached answers:', storedAnswers)
  }

  if (context.opts.answers === true) {
    logger.warn(
      `The yes flag has been set. This will automatically answer default value to all questions, which may have security implications.`
    )
  }

  const answers = await prompt(prompts, context.opts.answers, context.opts.mock)

  logger.debug(`Retrived answers:`, answers)

  const answersToStore: {[k: string]: any} = {}
  for (const p of prompts) {
    if (!Object.prototype.hasOwnProperty.call(answers, p.name)) {
      answers[p.name] = undefined
    }
    if (p.store) {
      answersToStore[p.name] = answers[p.name]
    }
  }
  if (!mock) {
    store.set(STORED_ANSWERS_ID, answersToStore)
    logger.debug('Cached prompt answers:', answersToStore)
  }

  context.answers = answers
}
