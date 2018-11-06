const inquirer = require('inquirer')
const resolveFrom = require('resolve-from')
const logger = require('./logger')
const store = require('./store')
const renderTemplate = require('./utils/renderTemplate')

/**
 * @param {Object} config
 * @param {Object} context
 */
module.exports = async (config, context) => {
  const prompts =
    typeof config.prompts === 'function'
      ? await config.prompts.call(context, context)
      : config.prompts

  const pkgPath = resolveFrom.silent(context.generator.path, './package.json')
  const pkgVersion = pkgPath ? require(pkgPath).version : ''
  const STORED_ANSWERS_ID = `answers.${context.generator.hash +
    '__npm__' +
    pkgVersion.replace(/\./g, '\\.')}`
  const storedAnswers = store.get(STORED_ANSWERS_ID) || {}

  const { mock, yes } = context.sao.opts
  if (!mock) {
    logger.debug('Reusing cached answers:', storedAnswers)
  }

  if (yes) {
    logger.warn(
      `The yes flag has been set. This will automatically answer default value to all questions, which may have security implications.`
    )
  }

  const prompt =
    mock || yes
      ? require('./utils/mockPrompt')(mock && mock.answers)
      : inquirer.prompt.bind(inquirer)
  const answers = await prompt(
    prompts.map(p => {
      if (typeof p.default === 'string') {
        p.default = renderTemplate(p.default, context)
      }
      if (!mock && p.store && storedAnswers[p.name] !== undefined) {
        p.default = storedAnswers[p.name]
      }
      return p
    })
  )

  logger.debug(`Retrived answers:`, answers)

  const answersToStore = {}
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

  context._answers = answers
}
