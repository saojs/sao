# Writing Tests

SAO provides a simple API to test out your template generation:

Let's say you have an `sao.js` at directory `/path/to/template`:

```js
// sao.js
module.exports = {
  prompts: {
    license: {
      type: 'confirm',
      message: 'Add a LICENSE file to your file?',
      default: true
    }
  }
}
```

```js
// test.js
const sao = require('sao')

const template = {
  fromPath: '/path/to/template'
}

// Example is using jest/jasmine syntax
it('adds license file', () => {
  return sao.mockPrompt(template, {
    // Here is the mocked prompts value
    // It uses the `default` value by default
  }).then(stream => {
    expect(stream.fileList).toContain('LICENSE')
  })
})

it('does not add license file', () => {
  return sao.mockPrompt(template, {
    license: false
  }).then(stream => {
    expect(stream.fileList).not.toContain('LICENSE')
    expect(JSON.parse(stream.fileContents('package.json'))).toHaveProperty('author')
  })
})
```

Check out the test for [template-nm](https://github.com/egoist/template-nm/blob/master/test/test.js) as an offcial example.

## API

### sao.mockPrompt(template, mockedPromptValue)

#### template

##### template.fromPath

The path to your template, most likely it will be the directory to `sao.js`.

#### mockedPromptValue

Type: `object`

Mocked value for prompts.

#### Return value

It returns a Promise resolving [`stream`](https://github.com/egoist/majo/blob/master/docs/api.md):

##### stream.fileList

An array of the path to generated files, eg:

```js
[
  'LICENSE',
  '.gitignore',
  'src/index.js'
]
```

##### stream.files

An object of the generated file tree eg:

```js
{
  'src/index.js': {
    contents: <Buffer>,
    stats: {}, // fs.Stats object
    path: '/absolute/path/to/src/index.js'
  }
}
```

For more please check out [majo stream API](https://github.com/egoist/majo/blob/master/docs/api.md).
