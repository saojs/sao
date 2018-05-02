const path = require('path')
const os = require('os')
const { fs } = require('majo')
const promisify = require('./utils/promisify')

const download = promisify(require('download-git-repo'))

const reposDir = path.join(os.homedir(), '.sao', 'repos')

module.exports = async ({ user, repo, version, clone, forceDownload, packageManager } = {}) => {
  const folder = `${user}--${repo}`
  const p = path.join(reposDir, folder)
  if (!(await fs.exists(p)) || forceDownload) {
    const spinner = require('./spinner').start(
      `Downloading ${user}/${repo}`
    )
    await fs.remove(p)
    try {
      await download(
        user + '/' + repo + (version ? `#${version}` : ''),
        path.join(reposDir, folder),
        { clone }
      )
    } catch (err) {
      spinner.stop()
      throw err
    }

    // Ensure deps of the repo
    const pkgPath = path.join(reposDir, folder, 'package.json')

    if (await fs.exists(pkgPath)) {
      const pkg = require(pkgPath)
      const deps = pkg.dependencies && Object.keys(pkg.dependencies)
      if (deps && deps.length > 0) {
        spinner.text = `Installing dependencies for the generator`
        try {
          await require('install-packages')({
            logTitle: false,
            cwd: path.join(reposDir, folder),
            packageManager,
            args: ['--production']
          })
        } catch (err) {
          spinner.stop()
          throw err
        }
      }
    }

    spinner.stop()
  }
  return p
}
