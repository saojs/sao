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
import test from 'ava'
import sao from 'sao'

const template = {
  fromPath: '/path/to/template'
}

test('default values', async t => {
  const stream = await sao.mockPrompt(template, {
    // Here is the mocked prompts value
    // It uses the `default` value by default
  })

  t.snapshot(stream.fileList, 'Generated files')
  const pkg = JSON.parse(stream.fileContents('package.json'))
  t.is(pkg.license, 'MIT')
})

test('no license file', async t => {
  const stream = await sao.mockPrompt(template, {
    license: false
  })

  t.snapshot(stream.fileList, 'Generated files')
  const pkg = JSON.parse(stream.fileContents('package.json'))
  t.false('license' in pkg)
})

test('init to current working directory', async t => {
  const stream = await sao.mockPrompt(template, {
    license: false,
    targetPath: './'
  })

  t.snapshot(stream.fileList, 'Generated files');
})
```

Here we're using AVA [snapshot test](https://github.com/avajs/ava#snapshot-testing) so that we don't have to write expected file list manually.

Examples:

- [template-nm](https://github.com/egoist/template-nm/blob/master/test/test.js)
- [template-next](https://github.com/egoist/template-next/blob/master/test/test.js)

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
