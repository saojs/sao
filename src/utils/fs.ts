import fs from 'fs'
import move from 'move-file'

export { ensureDir, remove, outputFile } from 'majo'

export const pathExists = async (path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path)
    return true
  } catch (_) {
    return false
  }
}

export {
  move
}

export const readFile = fs.promises.readFile
