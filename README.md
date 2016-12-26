# SAO

[![NPM version](https://img.shields.io/npm/v/sao.svg?style=flat)](https://npmjs.com/package/sao) [![NPM downloads](https://img.shields.io/npm/dm/sao.svg?style=flat)](https://npmjs.com/package/sao) [![Build Status](https://img.shields.io/circleci/project/egoist/sao/master.svg?style=flat)](https://circleci.com/gh/egoist/sao) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## tl;dr

```bash
yarn global add sao

cd new-project
sao egoist/template-vue
# or install the template from npm
sao vue
```

## Motivation

[yeoman](https://github.com/yeoman/yo) is too complex, and [vue-cli](https://github.com/vuejs/vue-cli) has a narrow name, so I made **sao**.

**sao** is compatible with:

- regular git repo
- sao template as git repo
- sao template as npm package

## Usage

```bash
cd new-project
# for a regular git repo
# it simply copie all contents inside to current working directory
sao user/repo

# you can also use the config file: sao.js
# to control the process

# if the name does not contains slash `/`
# it will be recognized as an npm package and prefixed with `template-`
# and you should install it before running `sao`
yarn global add template-vue-starter
sao vue-starter

# if you're generating from a repo
# you can use cached version from ~/.sao/repos
sao user/repo --git-cache

# use local folder (relative or absolute path)
# i.e. starts with `.` or `/`
sao ./templates/vue-starter

# you can also generate to a folder instead of cwd
sao user/repo new-project
```

## Config File

The default config is `./sao.js` or `./sao.json` in your template, `sao` will copy `./template` folder in your template.

You can also use `--config` option to set custom config file.

### Prompts

You can use [ejs](http://ejs.co/) syntax in your template, and use prompts to retrieve data from user.

```js
module.exports = {
  prompts: {
    eslint: {
      type: 'list',
      message: 'Choose the eslint config:',
      choices: [
        'airbnb',
        'standard',
        'xo',
        'react'
      ]
    }
  }
}
```

The prompt object is actually similar to which in https://github.com/SBoudrias/Inquirer.js, except here's no `name` property.

Then you can just use the answers of prompts in your template, for example:

```json
{
  "devDependencies": {
    "eslint-config-<%= eslint %>": "latest"
  }
}
```

### Filters

You can filter files with user prompts, for example:

```js
module.exports = {
  prompts: {
    jsx: {
      type: 'confirm',
      message: 'Use JSX in your project?'
    }
  },
  filters: {
    'lib/*.jsx': "jsx",
    "lib/*.js": "!jsx"
  }
}
```

The key of each entry supports [minimatch](https://github.com/isaacs/minimatch#features) pattern.

The value supports JavaScript expression.

### skipInterpolation

Prevent from rendering template syntax in specified files:

```js
module.exports = {
  skipInterpolation: [
    'lib/*.txt',
    'foo.js'
  ]
}
```

### Life Hooks

#### post hook

This hooks will be invoked after everything ends:

```js
module.exports = {
  post() {
    // perform your logic
  }
}
```

## FAQ

### Store template in repo or npm package?

Comparing to using repo over npm package:

- pros: only `git push` is enough, looks less verbose
- cons:
 - you can require external npm package in `sao.js` if you publish it to npm, since it's installed by `npm i -g` or `yarn global add`, while a repo is simply extracted after download.
 - by default you need to download repo each time you run `sao`, however there's a `--git-cache` option to let you use previously downloaded version.

### Is it compatible with vue-cli?

Some options are different, for example `post` option in `sao` is `completeMessage` in `vue-cli`, if you want to use a vue-cli template, use `config` option to point to `meta.json` or `meta.js`:

```bash
sao vuejs-templates/webpack --config meta
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**sao** © [EGOIST](https://github.com/egoist), Released under the [MIT](https://egoist.mit-license.org/) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/sao/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)

![preview](http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-126926.png)
