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
- sao template in local folder

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

### Generate project for the first time

For the first time to generate project from a template, you need `--install` option:

```bash
sao template --install
```

For example, if it's an npm package we'll install `template-template` for you, otherwise we download that git repo for you.

When you run `sao` without `--install` option it will use cached version, if it's not cached yet, there would be a warning.

## FAQ

### Store template in repo or npm package?

Do what you prefer, no real difference here, except for npm package you need to publish it, but the name would be shorter than `user/repo` you know.

### Is it compatible with vue-cli?

Some options are different, for example `post` option in `sao` is `completeMessage` in `vue-cli`, if you want to use a vue-cli template, use `config` option to point to `meta.json` or `meta.js`:

```bash
sao vuejs-templates/webpack --config meta.json
```
