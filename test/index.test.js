const path = require('path')
const sao = require('..')

test('simple template', () => {
  return sao.mockPrompt({
    fromPath: path.join(__dirname, 'fixture/simple'),
    targetPath: path.join(__dirname, 'output/simple')
  }, {
    test: false
  }).then(({ fileList, files }) => {
    expect(fileList).toEqual(['.gitignore', 'bar/bar.js', 'foo.js'])
    expect(files['foo.js'].contents.toString()).toMatch('no')
  })
})

// Not a template (no sao.js), simply copy the whole root foler
test('non-template', () => {
  return sao.mockPrompt({
    fromPath: path.join(__dirname, 'fixture/non-template'),
    targetPath: path.join(__dirname, 'output/non-template')
  }).then(({ fileList }) => {
    expect(fileList).toEqual(['a.js', 'b.js'])
  })
})
