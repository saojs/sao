---
nav: zh
---


<img src="./media/sao.png" width="200" />
<br>
<br>

[![NPM version](https://img.shields.io/npm/v/sao.svg?style=flat)](https://npmjs.com/package/sao) [![NPM downloads](https://img.shields.io/npm/dm/sao.svg?style=flat)](https://npmjs.com/package/sao) [![Build Status](https://img.shields.io/circleci/project/egoist/sao/master.svg?style=flat)](https://circleci.com/gh/egoist/sao) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

来自未来的项目构建工具。

## 由来

[yeoman](https://github.com/yeoman/yo) 的 generator 系统略显繁琐，而 [vue-cli](https://github.com/vuejs/vue-cli) 这个名字不太适合用来构建非 Vue 项目，所以我做了 **sao** 这个项目。

**sao** 可以兼容:

- 普通的 git 项目
- 存放在 git repo 里的模板
- 存放在 npm 模块里的模板
- 本地模板

## 安装

```bash
yarn global add sao
# npm i -g sao
```

## 基本用法

### 从 git repo 构建

你可以从一个 git repo 生成项目:

```bash
cd new-project
# 对于一个普通的 git repo 它会直接复制 repo 里的所有文件到当前文件夹
sao user/repo
```

### 用 npm 包构建

```bash
# 如果这个模板的名字里没有 `/` 那它就会被当做 npm 包
# 你需要先安装这个 npm 包
yarn global add template-vue-starter
cd new-project
sao vue-starter
```

### 从本地目录

使用相对路径 `.` 或者绝对路径 `/` :

```bash
cd new-project
sao ../path/to/template
```

## 命令行详细用法

### 生成到一个新文件夹

```bash
# 这样会生成到当前文件夹
sao foo
# 可以用第二个参数指定你要生成到的文件夹
sao foo my-project
```

### 第一次是用一个模板

第一次使用一个模板需要带上 `--install` 选项，这样它会帮你下载 git repo 或者安装 npm 包:

```bash
sao template --install
```

对于 npm 包我们规定它的名字以 `template-` 开始，比如叫 `template-foo`，这样在命令行你只需要输入 `sao foo` 就行了。

当不加 `--install` 参数的时候它会使用缓存的版本，如果没有缓存的版本它会提示你。

## 常见问题

### 我该发布模板到 git repo 还是 npm 包?

两个都差不多，不过 npm 包的话你需要发布它到 npm，会多一个步骤。不过你知道的用 npm 包你在命令行输的名字会更短，因为可以省略 `template-` 前缀。

### 这和 vue-cli 兼容吗?

有些选项相同，比如 `filters`，不过也有很多不同。

