import { RepoGenerator, LocalGenerator, NpmGenerator } from '../parse-generator'
import { pathExists, outputFile } from './fs'
import { spinner } from '../spinner'
import { downloadRepo } from './download-repo'
import { logger } from '../logger'
import { SAOError } from '../error'
import { generatorHasConfig } from '../generator-config'
import path from 'path'
import { installPackages } from '../install-packages'
import { colors } from './colors'
import { PACKAGES_CACHE_PATH } from '../paths'

/**
 * Ensure packages are installed in a generator
 * In most cases this is used for `repo` generators
 */
export async function ensureRepo(
  generator: RepoGenerator,
  {
    update,
    clone,
    registry,
  }: { update?: boolean; clone?: boolean; registry?: string }
): Promise<void> {
  if (!update && (await pathExists(generator.path))) {
    return
  }

  // Download repo
  spinner.start('Downloading repo')
  try {
    await downloadRepo(generator, {
      clone,
      outDir: generator.path,
    })
    spinner.stop()
    logger.success('Downloaded repo')
  } catch (err) {
    let message = err.message
    if (err.host && err.path) {
      message += '\n' + err.host + err.path
    }
    throw new SAOError(message)
  }
  // Only try to install dependencies for real generator
  const [hasConfig, hasPackageJson] = await Promise.all([
    generatorHasConfig(generator.path),
    pathExists(path.join(generator.path, 'package.json')),
  ])

  if (hasConfig && hasPackageJson) {
    await installPackages({
      cwd: generator.path,
      registry,
      installArgs: ['--production'],
    })
  }
}

export async function ensureLocal(generator: LocalGenerator): Promise<void> {
  const exists = await pathExists(generator.path)

  if (!exists) {
    throw new SAOError(
      `Directory ${colors.underline(generator.path)} does not exist`
    )
  }
}

export async function ensurePackage(
  generator: NpmGenerator,
  { update, registry }: { update?: boolean; registry?: string }
): Promise<void> {
  const installPath = path.join(PACKAGES_CACHE_PATH, generator.hash)

  if (update || !(await pathExists(generator.path))) {
    await outputFile(
      path.join(installPath, 'package.json'),
      JSON.stringify({
        private: true,
      }),
      'utf8'
    )
    logger.debug('Installing generator at', installPath)
    await installPackages({
      cwd: installPath,
      registry,
      packages: [`${generator.name}@${generator.version || 'latest'}`],
    })
  }
}
