<img src="./media/sao.png" width="200" />
<br>
<br>

[![NPM version](https://img.shields.io/npm/v/sao.svg?style=flat)](https://npmjs.com/package/sao) [![NPM downloads](https://img.shields.io/npm/dm/sao.svg?style=flat)](https://npmjs.com/package/sao) [![Build Status](https://img.shields.io/circleci/project/egoist/sao/master.svg?style=flat)](https://circleci.com/gh/egoist/sao) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

Futuristic scaffolding tool.

## Motivation

[yeoman](https://github.com/yeoman/yo) is too complex, and [vue-cli](https://github.com/vuejs/vue-cli) has a narrow name, so I made **sao**.

**sao** is compatible with:

- regular git repo
- sao template as git repo
- sao template as npm package

## Install

```bash
yarn global add sao
# npm i -g sao
```

## Basic Usage

### From Repo

You can generate project from a git repo:

```bash
cd new-project
# for a regular git repo
# it simply copie all contents inside to current working directory
sao user/repo
```

It will download the repo each time you run the command, however you can use `--git-cache` option to use cached version.

### From Package

You can also generate project from an npm package:

```bash
# if the name does not contains slash `/`
# it will be recognized as an npm package and prefixed with `template-`
# and you should install it before running `sao`
yarn global add template-vue-starter
cd new-project
sao vue-starter
```

### From Local Directory

You can use relative path `.` or absolute path `/`:

```bash
cd new-project
sao ../path/to/template
```

## CLI Usage

### Generate to another folder

```bash
# such thing will make sao generate files to ./
sao foo
# specific the second arg as target folder instead of using ./
sao foo my-project
```

### Use cached git repo

If you've already run something like `sao user/repo` once, you can use cached version later:

```bash
sao user/repo --git-cache
```

### Install package before generating

If you're using a template from npm registry, you have to install that package first:

```bash
yarn global add template-foo
# or
npm i -g template-foo
# then
sao foo
```

But sao gives you a short-hand option for this:

```bash
sao foo --install
```

It will automatically run Yarn or npm to install `template-foo` for you.

## FAQ

### Store template in repo or npm package?

For using repo over npm package:

- pros: only `git push` is enough, looks less verbose
- cons:
 - you can require external npm package in `sao.js` if you publish it to npm, since it's installed by `npm i -g` or `yarn global add`, while a repo is simply extracted after download.
 - by default you need to download repo each time you run `sao`, however there's a `--git-cache` option to let you use previously downloaded version.

### Is it compatible with vue-cli?

Some options are different, for example `post` option in `sao` is `completeMessage` in `vue-cli`, if you want to use a vue-cli template, use `config` option to point to `meta.json` or `meta.js`:

```bash
sao vuejs-templates/webpack --config meta
```
