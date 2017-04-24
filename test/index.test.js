const path = require('path')
const sao = require('..')

test('simple', () => {
  return sao.generate({
    fromPath: path.join(__dirname, 'fixture/simple'),
    targetPath: path.join(__dirname, 'output/simple'),
    config: {}
  }).then(files => {
    expect(files).toEqual(['foo.js', 'bar/bar.js'])
  })
})
