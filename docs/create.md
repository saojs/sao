# Creating a template

## Folder Structure

```bash
your-template/
  ├── README.md
  ├── sao.js
  └── template/
```

<p class="warning">
  Note that if you want to publish template to npm registry, don't add `.gitignore` to template folder, npm will rename it to `.npmignore`. You can give it another name and use [move](#move) to rename it after generated.
</p>

## Config File

The default config is `./sao.js` in your template, if config file exists `sao` will copy `./template` folder in your template, otherwise it copy root directory.

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

#### default value keywords

In [Inquirer](https://github.com/SBoudrias/Inquirer.js) you can use `default` property to set default value, so here we provided some keywords for you to set access some native data, for example, use `default: ':gitUser:'` to set default value to system git username.

List of keywords:

- `:folderName:` Set default value to target folder name
- `:gitUser:` Set default value to git username
- `:gitEmail:` Set default value to git email

#### store

Store the typed answer to be used next time.

### filters

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

### enforceNewFolder

Enforce user to initialize project to a new folder, i.e. it has to be `sao template folder`

### enforceCurrentFolder

Enforce user to initialize project to current working directory, i.e. it has to be `sao template`

### move

Similar to unix `mv` command:

```js
module.exports = {
  move: {
    'lib/foo-*.js': 'bar.js'
  }
}
```

This action will be performed after files are generated so that you can use `move` as rename. Check out [template-gi](https://github.com/egoist/template-gi/blob/master/sao.js) for real world usage.

### Custom Template Engine

You can use any template engine supported by [jstransfomer](https://github.com/jstransformers), by default we use [ejs](http://ejs.co):

```js
// change to marko
module.exports = {
  template: 'marko',
  templateOptions: {}
}
```

And don't forget to install that transformer in your template:

```bash
yarn add jstransfomer-marko
```

Alternatively, you can directly pass the module in the option:

```js
module.exports = {
  template: require('jstransformer-marko')
}
```

<p class="tip">
  Note that if you are setting `template` to `handlebars`, you don't need to install it in your template, we have that module built-in already.
</p>

### templateFolder

By default, if there's config file, the `template` folder will be used as template folder, but you can also set a custom folder:

```js
module.exports = {
  // copy root directory
  templateFolder: './'
}
```

### Life Hooks

#### post hook

This hooks will be invoked after everything ends:

```js
module.exports = {
  post(context) {
    // perform your logic
  }
}
```

### context

As you may notice, there's a `context` argument in `post hook`:

```js
module.exports = {
  post(context) {
    console.log(context.isNewFolder)
    // ...
  }
}
```

#### isNewFolder

Type: `boolean`

Get if it's generating to a new project rather than current working directory.

#### folderName

Type: `string`

No matter if it's current directory or a new folder, this will always return the name of the folder.

#### folderPath

Type: `string`

The path to dest folder.

#### install

Type: `function`

Run `yarn install` or `npm install` in dest folder path, just call `install()` is enough.

#### init

Type: `function`

Run `git init` in dest folder path, just call `init()` is enough.

#### log

A fancy log utility, available methods: `log.info(msg)` `log.error(msg)` `log.success(msg)` `log.warn(msg)`

#### chalk

The [chalk](https://github.com/chalk/chalk) module as argument.

#### $

The [shelljs](https://github.com/shelljs/shelljs) module as argument.

#### answers

The answers of prompts.

<p class="warning">
  You can also access some of them in template files via underscore <code>\_</code>, for example <code>&lt;%= \_.folderName %&gt;</code>
</p>

The list of methods/variables available in templates:

- isNewFolder
- folderName
