const path = require('path')
const sao = require('..')

test('simple template', () => {
  return sao.mockPrompt({
    fromPath: path.join(__dirname, 'fixture/simple'),
    targetPath: path.join(__dirname, 'output/simple')
  }, {
    test: false
  }).then(files => {
    const filenames = Object.keys(files)
    expect(filenames).toEqual(['foo.js', 'bar/bar.js', '.gitignore'])
  })
})

// Not a template (no sao.js), simply copy the whole root foler
test('non-template', () => {
  return sao.generate({
    fromPath: path.join(__dirname, 'fixture/non-template'),
    targetPath: path.join(__dirname, 'output/non-template')
  }).then(files => {
    const filenames = Object.keys(files)
    expect(filenames).toEqual(['a.js', 'b.js'])
  })
})
