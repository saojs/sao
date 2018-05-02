const parse = require('../parseGenerator')

function snapshot(title, strings) {
  test(title, () => {
    strings.forEach(str => {
      expect(parse(str)).toMatchSnapshot(str)
    })
  })
}

snapshot('local', [
  './foo',
  './foo:foo:bar:baz',
  '/foo:hehehehe:as'
])

snapshot('npm', [
  'foo',
  'npm:hehe',
  'foo:hehe',
  'npm:haha:bar'
])

snapshot('git', [
  'egoist/poi',
  'egoist/poi:foo:bar',
  'gitlab:egoist/repo'
])
