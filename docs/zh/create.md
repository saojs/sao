---
nav: zh
---

# 开发一个模板

## 目录结构

```bash
your-template/
  ├── README.md
  ├── sao.js
  └── template/
```

## 配置文件

默认的配置文件是 `sao.js`，如果项目中有这个文件那它就会复制 `template` 目录，反之则直接复制根目录。

你也可以使用 `--config` 来指定一个配置文件。

### 命令行提示

通过命令行提示来向用户获得一些数据，然后可以在模版中使用这些数据，模板支持 [ejs](http://ejs.co/) 语法。

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

提示的这个对象结构和 https://github.com/SBoudrias/Inquirer.js 这个库中的一样, e只是这个不是一个数组，`name` 属性变成了对象的 `key`。 


然后你可以像这样在模版中使用获得的数据:

```json
{
  "devDependencies": {
    "eslint-config-<%= eslint %>": "latest"
  }
}
```

#### Role

我们的命令提示还有一个额外的属性 `role`，用它给你的提示赋予一些默认的行为:

```js
module.exports = {
  prompts: {
    projectName: {
      role: 'folder:name',
      message: '输入项目明:'
    }
  }
}
```

这里 `projectName` 的默认值会变成目标文件夹的名字。

内置 `role` 的列表:

- `folder:name`: 把默认值设置为目标文件夹的名字
- `git:name`: 把默认值设置为 git 用户名
- `git:email`: 把默认值设置为 git 邮箱

### Filters

你还可以用从命令行提示获取的数据来过滤文件:

```js
module.exports = {
  prompts: {
    jsx: {
      type: 'confirm',
      message: '在项目中使用 jsx?'
    }
  },
  filters: {
    'lib/*.jsx': "jsx",
    "lib/*.js": "!jsx"
  }
}
```

这里每一个 key 是一个 [minimatch](https://github.com/isaacs/minimatch#features) 类型。

而它的值是一个 JavaScript 表达式。

### skipInterpolation

你可以让一些文件跳过模板插值:

```js
module.exports = {
  skipInterpolation: [
    'lib/*.txt',
    'foo.js'
  ]
}
```

### enforceNewFolder

强制这个模板只能用于生成新文件夹, 也就是说必须这样: `sao template folder`

### enforceCurrentFolder

强制这个模板只能生成文件到当前目录, 也就是说必须这样: `sao template`

### move

类似 unix 系统的 `mv` 命令：

```js
module.exports = {
  move: {
    'lib/foo-*.js': 'bar.js'
  }
}
```

这个行为会在文件生成之后被执行，你可以用这个作为重命名的功能，你可以参考 [template-gi](https://github.com/egoist/template-gi/blob/master/sao.js) 来查阅实际用例。

### 自定义模板引擎

你可以使用任何 [jstransfomer](https://github.com/jstransformers) 支持的模板引擎, 默认我们使用 [ejs](http://ejs.co):

```js
// 换成 handlebars:
module.exports = {
  template: 'handlebars',
  templateOptions: {
    helpers: {} // custom handlebars helpers
  }
}
```

别忘了在模版中安装相应的模块:

```bash
yarn add jstransfomer-handlebars
```

你也可以直接 require 这个模块:

```js
module.exports = {
  template: require('jstransformer-handlebars')
}
```

### 生命周期

#### post 钩子

这个函数会在所有操作结束之后执行:

```js
module.exports = {
  post(context) {
    // 比如输出一些 log 提示成功
  }
}
```

## context

你可能注意到了，`post` 钩子又一个 `context` 参数:

```json
{
  "name": "<%= _.folderName %>"
}
```

### isNewFolder

Type: `boolean`

目标文件夹是否是新文件夹。

### folderName

Type: `string`

目标文件夹的名字。

### folderPath

Type: `string`

目标文件夹的路径。

### install

Type: `function`

在目标文件夹执行 `yarn install` 或者 `npm install`，直接调用 `install()` 就行了。

### init

Type: `function`

在目标文件夹执行 `git init`，直接调用 `init()` 就行了。

### log

一个生成易读日志的组件，你可以调用: `log.info(msg)` `log.error(msg)` `log.success(msg)` `log.warn(msg)`

### chalk

[chalk](https://github.com/chalk/chalk) 模块

### $

[shelljs](https://github.com/shelljs/shelljs) 模块。

### data

命令行提示的返回结果。

<p class="warning">
  注意这其中只有部分可以在模板插值的时候使用，你可以通过下划线访问它们，比如 <code>&lt;%= \_.folderName %&gt;</code>
</p>

在模板插值的时候可以使用的有:

- isNewFolder
- folderName
