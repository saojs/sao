import os from 'os'
import path from 'path'

// Only update this when we have to clear cache
const SAO_CACHE_VERSION = 2

export const ROOT_CACHE_PATH = path.join(
  os.homedir(),
  `.sao/V${SAO_CACHE_VERSION}`
)
export const REPOS_CACHE_PATH = path.join(ROOT_CACHE_PATH, 'repos')
export const PACKAGES_CACHE_PATH = path.join(ROOT_CACHE_PATH, 'packages')
