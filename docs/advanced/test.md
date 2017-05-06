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
      default: false
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
  }).then(res => {
    expect(res.fileList).toContain('LICENSE')
  })
})

it('does not add license file', () => {
  return sao.mockPrompt(template, {
    license: false
  }).then(res => {
    expect(res.fileList).not.toContain('LICENSE')
  })
})
```

## API

### sao.mockPrompt(template, mockedPromptValue)

#### template

##### fromPath

Type: `object`

The path to your template, most likely it will be the directory to `sao.js`.

#### mockedPromptValue

Type: `object`

Mocked value for prompts.

#### Return value

##### res.fileList

An array of the path to generated files, eg:

```js
[
  'LICENSE',
  '.gitignore',
  'src/index.js'
]
```

##### res.files

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
