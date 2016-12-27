# Creating a template

## Folder Structure

```bash
your-template/
  ├── README.md
  ├── sao.js
  └── template/
```

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

#### Role

You can use `role` to apply built-in options to the prompt, for example:

```js
module.exports = {
  prompts: {
    projectName: {
      role: 'folder:name',
      message: 'Type your project name:'
    }
  }
}
```

Then the default value `projectName` will be the target folder name.

List of built-in roles:

- `folder:name`: Set default value to target folder name
- `git:name`: Set default value to git username
- `git:email`: Set default value to git email

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
  post(context) {
    // perform your logic
  }
}
```

## context

As you may notice, there's a `context` argument in `post hook`, it's also available in your template markup as underscore `_`, for example:

```json
{
  "name": "<%= _.folderName %>"
}
```

### isNewFolder

Type: `boolean`

Get if it's generating to a new project rather than current working directory.

### folderName

Type: `string`

No matter if it's current directory or a new folder, this will always return the name of the folder.

### chalk

The [chalk](https://github.com/chalk/chalk) module as argument.
