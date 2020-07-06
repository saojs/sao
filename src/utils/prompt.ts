import enquirer from 'enquirer'

export interface PromptState {
  answers: {
    [k: string]: any
  }
}

export interface BasePrompt {
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

export interface InputPrompt extends BasePrompt {
  type: 'input'
}

export interface ConfirmPrompt extends BasePrompt {
  type: 'confirm'
}

export type Prompt = InputPrompt | ConfirmPrompt

interface EnquirerContext {
  value: string
  state: any
}

export const prompt = async (prompts: Prompt[]): Promise<{[k: string]: any}> => {
  const answers = await enquirer.prompt(
    // @ts-ignore
    prompts.map((prompt) => {
      return {
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
          if (typeof prompt.default === 'function')  {
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
