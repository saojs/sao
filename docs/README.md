<img src="./media/sao.png" width="200" />
<br>
<br>

[![NPM version](https://img.shields.io/npm/v/sao.svg?style=flat)](https://npmjs.com/package/sao) [![NPM downloads](https://img.shields.io/npm/dm/sao.svg?style=flat)](https://npmjs.com/package/sao) [![Build Status](https://img.shields.io/circleci/project/egoist/sao/master.svg?style=flat)](https://circleci.com/gh/egoist/sao) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

Futuristic scaffolding tool.

## Motivation

**yeoman** is too complex, while **vue-cli** is more than a scaffolding tool and lacks of some important features like *unit testing*, so I made **SAO**, basically it combines the powerful features of **yeoman** and the simplicity of **vue-cli**.

**SAO** is compatible with:

- Regular git repo (simply download it)
- SAO template as git repo
- SAO template as npm package
- SAO template in local folder

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
sao user/repo
```

It also supports advanced repo usage:

```bash
# Use --clone to download private git repo
sao user/repo --clone

# Use other git hosts
sao gitlab:user/repo
sao bitbucket:user/repo

# Specify git tag/branch
sao user/repo#1.0
sao user/repo#dev
```

### From Package

You can also generate project from an npm package:

```bash
# If the name does not contain slash `/`
# It will be recognized as an npm package and prefixed with `template-`
cd new-project
sao next
```

### From Local Directory

You can use relative path `.` or absolute path `/`:

```bash
cd new-project
sao ../path/to/template
```

## CLI Usage

### Generate to a new folder

Sometimes you want to create a new folder instead of generating to `cwd`

```bash
# Such command will make SAO generate files to ./
sao foo
# Specify the second arg as target folder instead of using ./
sao foo my-project
```

## FAQ

### Store template in repo or npm package?

If you use npm as the template host you can receive update notifier when a new version of relevant template is avaliable, while this is not possible when you're using git repo.

### Is it compatible with vue-cli?

Some options are the same, some options are different, so nah.
