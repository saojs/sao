# Standalone CLI

You can use SAO programatically to create a CLI for your own template, asumming that you already have an SAO template:

```bash
foo/
├── template/
├── sao.js
└── package.json
```

You published it as `foo` on npm so now you can only use it via `sao npm:foo`, to use it as a command `foo` you need to create `cli.js` in the root directory:

```js
#!/usr/bin/env node
const sao = require('sao')
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2))
// In a custom directory or current directory
const targetPath = argv._[0] || '.'

sao({
 // The path to your template
  template: __dirname,
  targetPath
}).catch(err => {
  console.error(err.name === 'SAOError' ? err.message : err.stack)
  process.exit(1)
})
```

*Then you can already run `node cli.js` to generate project from your template, basically it's equivalent to `sao npm:foo`.*

Finally you can configure the [`bin`](https://docs.npmjs.com/files/package.json#bin) field in `package.json`:

```json
{
  "name": "foo",
  "bin": "cli.js",
  "files": [
    "sao.js",
    "cli.js",
    "template"
  ]
}
```

Now people can run following commands to use your template without installing SAO globally:

```bash
npm i -g foo
foo my-new-project
```

## Examples

- [lass](https://github.com/lassjs/lass) - scaffolds a modern package boilerplate for Node.js
- [lad](https://github.com/ladjs/lad) - scaffolds a Koa webapp and API framework for Node.js
