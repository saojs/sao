import Enquirer from 'enquirer'
import { SAOError } from '../error'

/**
 * The state of current running prompt
 */
export interface PromptState {
  /**
   * Prompt answers
   */
  answers: {
    [k: string]: any
  }
}

export interface BasePromptOptions {
  /**
   * Used as the key for the answer on the returned values (answers) object.
   */
  name: string
  /**
   * The message to display when the prompt is rendered in the terminal.
   */
  message: string
  /** Skip the prompt when returns `true` */
  skip?: (state: PromptState, value: any) => boolean
  /**
   * 	Function to validate the submitted value before it's returned.
   *  This function may return a boolean or a string.
   *  If a string is returned it will be used as the validation error message.
   */
  validate?: (value: string, state: PromptState) => boolean | string
  /**
   * Function to format the final submitted value before it's returned.
   */
  result?: (value: string, state: PromptState) => any
  /**
   * Function to format user input in the terminal.
   */
  format?: (value: string, state: PromptState) => Promise<string> | string
  /**
   * Store the prompt answer in order to reuse it as default value the next time
   * Defaults to `false`
   */
  store?: boolean
}

export type WithPromptState<T> = T | ((state: PromptState) => T)

export interface Choice {
  name: string
  message?: string
  value?: string
  hint?: string
  disabled?: boolean | string
}

export interface ArrayPromptOptions extends BasePromptOptions {
  type:
    | 'autocomplete'
    | 'editable'
    | 'form'
    | 'multiselect'
    | 'select'
    | 'survey'
    | 'list'
    | 'scale'
  choices: WithPromptState<string[] | Choice[]>
  /** Maxium number of options to select */
  maxChoices?: number
  /** Allow to select multiple options */
  muliple?: boolean
  /** Default value for the prompt */
  default?: WithPromptState<string>
  delay?: number
  separator?: boolean
  sort?: boolean
  linebreak?: boolean
  edgeLength?: number
  align?: 'left' | 'right'
  /** Make the options scrollable via arrow keys */
  scroll?: boolean
}

export interface BooleanPromptOptions extends BasePromptOptions {
  type: 'confirm'
  /** Default value for the prompt */
  default?: WithPromptState<boolean>
}

export interface StringPromptOptions extends BasePromptOptions {
  type: 'input' | 'invisible' | 'list' | 'password' | 'text'
  /** Default value for the prompt */
  default?: WithPromptState<string>
  /** Allow the input to be multiple lines */
  multiline?: boolean
}

export type PromptOptions =
  | ArrayPromptOptions
  | BooleanPromptOptions
  | StringPromptOptions

interface EnquirerContext {
  value: string
  state: PromptState
}

function validatePrompt(prompt: PromptOptions, index: number): void {
  if (!prompt.type) {
    throw new SAOError(`Missing property "type" on prompt (index: ${index})`)
  }

  if (!prompt.message) {
    throw new SAOError(`Missing property "message" on prompt (index: ${index})`)
  }

  if (!prompt.name) {
    throw new SAOError(`Missing property "name" on prompt (index: ${index})`)
  }
}

export const prompt = async (
  prompts: PromptOptions[],
  userSuppliedAnswers?: string | boolean | { [k: string]: any },
  mock?: boolean
): Promise<{ [k: string]: any }> => {
  const enquirer = new Enquirer()

  if (typeof userSuppliedAnswers === 'string') {
    userSuppliedAnswers = JSON.parse(userSuppliedAnswers)
  }

  enquirer.on('prompt', (prompt) => {
    prompt.once('run', async () => {
      if (typeof userSuppliedAnswers === 'object') {
        const value = userSuppliedAnswers[prompt.name]
        if (value !== undefined) {
          for (const char of String(value).split('')) {
            await prompt.keypress(char)
          }
        }
        if (mock || value !== undefined) {
          await prompt.submit()
        }
      } else if (userSuppliedAnswers === true || mock) {
        await prompt.submit()
      }
      if (mock) {
        await prompt.cursorShow()
      }
    })
  })

  const answers = await enquirer.prompt(
    // @ts-ignore
    prompts.map((prompt, index) => {
      validatePrompt(prompt, index)

      return {
        ...prompt,
        type: prompt.type,
        message: prompt.message,
        name: prompt.name,
        show: !mock,
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
            return ''
          }
          const value =
            typeof prompt.default === 'function'
              ? prompt.default(this.state)
              : prompt.default
          let choices = (prompt as ArrayPromptOptions).choices
          if (typeof choices === 'function') {
            choices = choices.call(this.state, this.state)
          }
          if (choices) {
            const index = choices.findIndex((c: string | Choice) => {
              if (typeof c === 'string') {
                return c === value
              }
              return typeof c === 'object' && c.name === value
            })
            return index
          }
          return value === undefined ? '' : value
        },
        format(this: EnquirerContext, value: any): any {
          if (prompt.format === undefined) {
            return value
          }
          return prompt.format(value, this.state)
        },
        choices(this: EnquirerContext): any {
          const choices = (prompt as ArrayPromptOptions).choices
          if (typeof choices === 'function') {
            return choices.call(this.state, this.state)
          }
          return choices
        },
      }
    })
  )

  return answers
}
