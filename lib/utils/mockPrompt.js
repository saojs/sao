module.exports = inputAnswers => async prompts => {
  inputAnswers = inputAnswers || {}
  const answers = {}

  for (const p of prompts) {
    const setValue = async val => {
      if (p.validate) {
        const res = await p.validate(val)
        if (res !== true) {
          throw new Error(`validation failed for prompt: ${p}`)
        }
      }

      answers[p.name] = p.filter ? await p.filter(val) : val
    }

    const when = typeof p.when === 'function' ? await p.when(answers) : p.when
    if (when === undefined || when === true) {
      const defaultValue =
        inputAnswers[p.name] === undefined ? p.default : inputAnswers[p.name]
      if (defaultValue !== undefined) {
        await setValue(
          typeof defaultValue === 'function'
            ? defaultValue(answers)
            : defaultValue
        )
      }
    }

    const a = answers[p.name]
    if (a === undefined && p.required) {
      throw new Error(`missing answer for required prompt: ${p}`)
    }
  }

  return answers
}
