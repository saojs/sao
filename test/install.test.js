import path from 'path'
import test from 'ava'
import sao from '..'

const resolveRelative = path.resolve.bind(null, __dirname)

test('install', async t => {
  const fromPath = resolveRelative('fixture/template-install')
  const targetPath = resolveRelative(fromPath, 'target')
  const deps = [resolveRelative(fromPath, 'local-pkgs/pkg-foo')]
  const devDeps = [resolveRelative(fromPath, 'local-pkgs/pkg-bar')]

  await sao.mockPrompt(
    { fromPath, targetPath, log: true, write: true },
    { deps, devDeps }
  )

  const pkg = require(resolveRelative(targetPath, 'package.json'))
  const getDeps = deps => {
    return deps.reduce((acc, pkg) => {
      acc[path.basename(pkg)] = pkg
      return acc
    }, {})
  }
  t.deepEqual(
    pkg.dependencies,
    Object.assign({ noop3: '999.999.999' }, getDeps(deps))
  )
  t.deepEqual(pkg.devDependencies, getDeps(devDeps))
})
