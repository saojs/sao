import Enquirer from 'enquirer'

export interface PromptState {
  answers: {
    [k: string]: any
  }
}

export interface BasePromptOptions {
  name: string
  message: string
  skip?: (state: PromptState, value: any) => boolean
  validate?: (value: string, state: PromptState) => boolean | string
  result?: (value: string, state: PromptState) => any
  default?: any | ((state: PromptState) => Promise<any> | any)
  format?: (value: string, state: PromptState) => Promise<string> | string
  /**
   * Store the prompt answer in order to reuse it as default value the next time
   */
  store?: boolean
}

type DefaultValue<T> = T | ((state: PromptState) => T)

interface Choice {
  name: string
  message?: string
  value?: string
  hint?: string
  disabled?: boolean | string
}

interface ArrayPromptOptions extends BasePromptOptions {
  type:
    | 'autocomplete'
    | 'editable'
    | 'form'
    | 'multiselect'
    | 'select'
    | 'survey'
    | 'list'
    | 'scale'
  choices: string[] | Choice[]
  maxChoices?: number
  muliple?: boolean
  default?: DefaultValue<number>
  delay?: number
  separator?: boolean
  sort?: boolean
  linebreak?: boolean
  edgeLength?: number
  align?: 'left' | 'right'
  scroll?: boolean
}

interface BooleanPromptOptions extends BasePromptOptions {
  type: 'confirm'
  default?: DefaultValue<boolean>
}

interface StringPromptOptions extends BasePromptOptions {
  type: 'input' | 'invisible' | 'list' | 'password' | 'text'
  default?: DefaultValue<string>
  multiline?: boolean
}

export type PromptOptions =
  | ArrayPromptOptions
  | BooleanPromptOptions
  | StringPromptOptions

interface EnquirerContext {
  value: string
  state: any
}

export const prompt = async (
  prompts: PromptOptions[],
  userSuppliedAnswers?: string | boolean | { [k: string]: any }
): Promise<{ [k: string]: any }> => {
  const enquirer = new Enquirer()

  if (typeof userSuppliedAnswers === 'string') {
    userSuppliedAnswers = JSON.parse(userSuppliedAnswers)
  }

  enquirer.on('prompt', (prompt) => {
    prompt.once('run', async () => {
      if (
        typeof userSuppliedAnswers === 'object' &&
        prompt.name in userSuppliedAnswers
      ) {
        await prompt.keypress(String(userSuppliedAnswers[prompt.name]))
        await prompt.submit()
      } else if (userSuppliedAnswers === true) {
        await prompt.submit()
      }
    })
  })

  const answers = await enquirer.prompt(
    // @ts-ignore
    prompts.map((prompt) => {
      return {
        ...prompt,
        type: prompt.type,
        message: prompt.message,
        name: prompt.name,
        skip(this: EnquirerContext, _: string, value: string): any {
          if (prompt.skip === undefined) {
            return false
          }
          return prompt.skip(this.state, value)
        },
        validate(this: EnquirerContext): any {
          if (prompt.validate === undefined) {
            return true
          }
          return prompt.validate(this.value, this.state)
        },
        result(this: EnquirerContext, value: any): any {
          if (prompt.result === undefined) {
            return value
          }
          return prompt.result(value, this.state)
        },
        initial(this: EnquirerContext): any {
          if (prompt.default === undefined) {
            return
          }
          if (typeof prompt.default === 'function') {
            return prompt.default(this.state)
          }
          return prompt.default
        },
        format(this: EnquirerContext, value: any): any {
          if (prompt.format === undefined) {
            return value
          }
          return prompt.format(value, this.state)
        },
      }
    })
  )

  return answers
}
