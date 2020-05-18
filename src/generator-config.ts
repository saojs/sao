import path from 'path'
import JoyCon from 'joycon'
import { GeneratorContext } from './generator-context'
import { Prompt } from './utils/prompt'

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
  data?: DataFunction
}

type DataFunction = (
  this: GeneratorContext,
  ctx: GeneratorContext
) => { [k: string]: any }

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
   * Check for npm generator updates
   * Enabled by default
   */
  updateCheck?: boolean
  /**
   * Transform template content with `ejs`
   * Defaults to `true`
   */
  transform?: boolean
  /**
   * Custom data to use in template transformation
   */
  data?: DataFunction
  prompts?:
    | Prompt[]
    | ((
        this: GeneratorContext,
        ctx: GeneratorContext
      ) => Prompt[] | Promise<Prompt[]>)
  actions?:
    | Action[]
    | ((
        this: GeneratorContext,
        ctx: GeneratorContext
      ) => Action[] | Promise<Action[]>)
  templateDir?: string
  templateData?: {
    [k: string]: any
  }
  subGenerators?: Array<{
    name: string
    generator: string
  }>
  prepare?: (
    this: GeneratorContext,
    ctx: GeneratorContext
  ) => Promise<void> | void
  completed?: (
    this: GeneratorContext,
    ctx: GeneratorContext
  ) => Promise<void> | void
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
