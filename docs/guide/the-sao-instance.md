# The SAO Instance

## Properties

### sao.answers

- __Type__: `{[k: string]: any}`

Prompts answers.

### sao.options

- __options__
   - __outDir__: `{string}` The absolute path to target directory
   - __outDirName__: `{string}` The basename of target directory
   - __inPlace__: `{boolean}` Whether the `outDir` is current working directory

Internal SAO options.

### sao.logger

- __logger__
  - __info(...args)__
  - __success(...args)__
  - __warn(...args)__
  - __error(...args)__

Internal SAO logger.

### sao.color

Basically the [`chalk`](https://github.com/chalk/chalk) module.

## Methods

### sao.gitInit()

- __Return__: `Promise<void>`

Run `git init` in target directory.

### sao.npmInstall([options])

- __Arguments__:
  - __options__:
    - __packageManager__: `{string=}`, can be `yarn` or `npm`
    - __packages__: `string[]=`, by default install dependencies in `package.json`
- __Return__: `Promise<void>`

Install npm packages in target directory, automatically infer the package manager.

### sao.showCompleteTips()

- __Return__: `void`

Show tips.
