import path from 'path'
import JoyCon from 'joycon'
import { PromptOptions } from './utils/prompt'
import { SAO } from './'

const joycon = new JoyCon({
  files: ['saofile.js', 'saofile.json'],
})

export interface AddAction {
  type: 'add'
  templateDir?: string
  files: string[] | string
  filters?: {
    [k: string]: string | boolean | null | undefined
  }
  /** Transform the template with ejs */
  transform?: boolean
  /**
   * Only transform files matching given minimatch patterns
   */
  transformInclude?: string[]
  /**
   * Don't transform files matching given minimatch patterns
   */
  transformExclude?: string
  /**
   * Custom data to use in template transformation
   */
  data?: DataFunction | object
}

type DataFunction = (this: SAO, context: SAO) => object

export interface MoveAction {
  type: 'move'
  patterns: {
    [k: string]: string
  }
}

export interface ModifyAction {
  type: 'modify'
  files: string | string[]
  handler: (data: any, filepath: string) => any
}

export interface RemoveAction {
  type: 'remove'
  files: string | string[] | { [k: string]: string | boolean }
  when: boolean | string
}

export type Action = AddAction | MoveAction | ModifyAction | RemoveAction

export interface GeneratorConfig {
  /**
   * Generator description
   * Used in CLI output
   */
  description?: string
  /**
   * Check updates for npm generators
   * Defaults to `true`
   */
  updateCheck?: boolean
  /**
   * Transform template content with `ejs`
   * Defaults to `true`
   */
  transform?: boolean
  /**
   * Extra data to use in template transformation
   */
  data?: DataFunction
  /**
   * Use prompts to ask questions before generating project
   */
  prompts?:
    | PromptOptions[]
    | ((this: SAO, ctx: SAO) => PromptOptions[] | Promise<PromptOptions[]>)
  /**
   * Use actions to control how files are generated
   */
  actions?: Action[] | ((this: SAO, ctx: SAO) => Action[] | Promise<Action[]>)
  /**
   * Directory to template folder
   * Defaults to `./template` in your generator folder
   */
  templateDir?: string
  /**
   * Sub generator
   */
  subGenerators?: Array<{
    name: string
    generator: string
  }>
  /**
   * Run some operations before starting
   */
  prepare?: (this: SAO, ctx: SAO) => Promise<void> | void
  /**
   * Run some operations when completed
   * e.g. log some success message
   */
  completed?: (this: SAO, ctx: SAO) => Promise<void> | void
}

export const loadGeneratorConfig = (
  cwd: string
): Promise<{ path?: string; data?: GeneratorConfig }> =>
  joycon.load({
    cwd,
    stopDir: path.dirname(cwd),
  })

export const generatorHasConfig = (cwd: string): boolean => {
  return Boolean(
    joycon.resolve({
      cwd,
      stopDir: path.dirname(cwd),
    })
  )
}
