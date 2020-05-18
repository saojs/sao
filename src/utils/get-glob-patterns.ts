import { evaluate } from './evaluate'

export const getGlobPatterns = (
  files: { [k: string]: any },
  context: any,
  getExcludedPatterns?: boolean
): string[] => {
  return Object.keys(files).filter((pattern) => {
    let condition = files[pattern]
    if (typeof condition === 'string') {
      condition = evaluate(condition, context)
    }
    return getExcludedPatterns ? !condition : condition
  })
}
