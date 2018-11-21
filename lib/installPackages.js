const readline = require('readline')
const stripAnsi = require('strip-ansi')
const spawn = require('cross-spawn')
const wcwidth = require('wcwidth')
const spinner = require('./spinner')
const logger = require('./logger')
const SAOError = require('./SAOError')

let cachedNpmClient = null

function setNpmClient(npmClient) {
  if (npmClient) {
    cachedNpmClient = npmClient
    return npmClient
  }

  const { stdout, status } = spawn.sync('yarn', ['--version'])
  cachedNpmClient = status === 0 && stdout ? 'yarn' : 'npm'
  return cachedNpmClient
}

function getNpmClient() {
  return cachedNpmClient || setNpmClient()
}

module.exports = async ({
  cwd,
  npmClient,
  installArgs,
  packages,
  saveDev,
  registry
}) => {
  npmClient = npmClient || getNpmClient()
  const packageName = packages ? packages.join(', ') : 'packages'

  return new Promise((resolve, reject) => {
    const args = [npmClient === 'yarn' ? 'add' : 'install'].concat(packages ? packages : [])
    if (saveDev) {
      args.push(npmClient === 'npm' ? '-D' : '--dev')
    }
    if (registry) {
      args.push('--registry', registry)
    }

    if (installArgs) {
      args.push(...installArgs)
    }

    logger.debug(npmClient, args.join(' '))
    spinner.start(`Installing ${packageName} with ${npmClient}`)
    const ps = spawn(npmClient, args, {
      stdio: [0, 'pipe', 'pipe'],
      cwd,
      env: Object.assign(
        {
          FORCE_COLOR: true,
          /* eslint-disable camelcase */
          npm_config_color: 'always',
          npm_config_progress: true
          /* eslint-enable camelcase */
        },
        process.env
      )
    })

    let output = ''
    const stream = process.stderr

    ps.stdout &&
      ps.stdout.on('data', data => {
        output += data
        spinner.stop()
        stream.write(data)
        spinner.start()
      })

    ps.stderr &&
      ps.stderr.on('data', data => {
        output += data
        spinner.stop()
        stream.write(data)
        spinner.start()
      })

    ps.on('close', code => {
      spinner.stop()
      // Clear output when succeeded
      if (code === 0) {
        const columns = stream.columns || 80
        const lineCount = stripAnsi(output)
          .split('\n')
          .reduce((count, line) => {
            return count + Math.max(1, Math.ceil(wcwidth(line) / columns))
          }, 0)
        for (let i = 0; i < lineCount; i++) {
          if (i > 0) {
            readline.moveCursor(stream, 0, -1)
          }
          readline.clearLine(stream, 0)
          readline.cursorTo(stream, 0)
        }
        logger.success(`Installed ${packageName}`)
      } else {
        throw new SAOError(`Failed to install ${packageName} in ${cwd}`)
      }
      resolve({ code, npmClient })
    })

    ps.on('error', reject)
  })
}

module.exports.getNpmClient = getNpmClient
module.exports.setNpmClient = setNpmClient
