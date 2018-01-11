# API

You can use `SAO` programatically:

```js
const sao = require('sao')

sao({
  template: 'nm',
  targetPath: 'new-project'
}).catch(err => {
  console.error(err)
})

// Downloading template if it's a git repo
sao.on('download:start', () => {
  console.log('Downloading...')
})
sao.on('download:stop', () => {
  console.log('Downloaded...')
})
// Installing template if it's an npm package
sao.on('install-template:start', (packageName, pm) => {
  // pm: package manager name, `yarn` or `npm`
  console.log(`> Installing ${packageName} with ${pm}...`)
})
```

## sao(options)

### options

#### template

Type: `string`<br>
Required: `true`

The template name, it supports all the types in SAO CLI, like npm package, git repo and local path.

#### targetPath

Type: `string`<br>
Default: `./`

The path to generate project.

#### config

Type: `string`<br>
Default: `sao.js`

Path to config file.

#### configOptions

Type: `object`<br>
Default: `{ flags }`

Options for config file when it exports a function, we merge your options with the defaults with `Object.assign({ flags }, yourOptions)`.

`flags` are camelcased.

#### update

Type: `boolean`

Always update template before generating even if it already exists.

#### removeStore

Type: `boolean`

Remove stored prompt answers.

#### skipStore

Type: `boolean`

Skip stored prompt answers.

#### forceNpm

Type: `boolean`

Always use `npm` instead of `yarn` to install templates and dependencies.

#### mockPrompts

Type: `object` `boolean`<br>
CLI alias: `--yes` `-y`

If `mockPrompts` is set we skip `prompts` and use the default values.

To override the value of specific ones in CLI you can use:

`--mockPrompts.foo 123 --mockPrompts.bar abc` which will be parsed to:

```js
{
  mockPrompts: { 
    ...defaultValues,
    foo: 123, 
    bar: 'abc'
  }
}
```

#### clone

Type: `boolean`

Use `git clone` to download repo.

#### updateNotify

Type: `boolean`

Print update notifier when relevant template has been updated, only works for npm packages.

## sao.mockPrompts(template, prompts)

Returns a Promise which resolves to `stream`.

### template

Type: `string` `object`

```js
{
  fromPath: string,
  templateContext: object
}
```

### prompts

Type: `object`

Mocked prompts. eg:

```js
{
  useReact: false,
  supportEslint: true
}
```
