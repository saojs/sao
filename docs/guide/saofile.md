# SAO Config File

::: tip
Make sure you have read the guide of how to [create a generator](./create-a-generator.md) first!
:::

Each root option in the `saofile.js` can also be a function which can access [SAO instance](./the-sao-instance.md) via `this`.

## Prompts

__Type__: `Prompt[]` | `(context: SAO) => Prompt[]`

`prompts` is a list of questions you want the user to answer.

All question types in [Inquirer.js](https://github.com/SBoudrias/Inquirer.js#question) are supported. There are some differences though:

### `when`

The `when` property in each prompt can __also__ be a string which will be evaluated in the context of `answers`.

For example:

```js{10}
prompts: [
  {
    name: 'useBundler',
    message: 'Do you want a bundler'
  },
  {
    name: 'bundler',
    type: 'list',
    choices: ['webpack', 'parcel', 'poi'],
    when: 'useBundler'
  }
]
```

Basically it's equivalent to `when: answers => answers.useBundler`.

### `store`

- __Type__: `boolean`
- __Default__: `false`

This is a property only for SAO, it is used to store user inputs so that SAO can use stored value as default value the next time.

### `default`

There're some placeholder keywords for setting default value:

- `[folderName]`: the name of target folder
- `[gitUser]`: the username of current git user
- `[gitEmail]`: the email of current git user

## Actions

`actions` is used to manipulate files. There're 4 kinds of actions which share following options:

- __type__: Action type
- __when__: Similar to `prompts`'s [`when`](#when).

### `type: 'add'`

Add files from `template` directory to target directory.

```js
actions: [
  {
    type: 'add',
    files: '**'
  }
]
```

- __files__: One or more glob patterns.
- __transform__: Enable/Disable transformer.
  - __Default__: `true`
- __transformer__:
  - __Default__: `ejs` (jstransformer-ejs)
- __transformerOptions__: Options for the transformer.
- __transformInclude__: One or more glob patterns, transform specific files with the transformer.
- __transformExclude__: One or more glob patterns, __DON'T__ transform specific files with the transformer.

### `type: 'modify'`

Modify files in target directory.

```js
actions: [
  {
    type: 'modify',
    files: 'package.json',
    handler(data, filepath) {
      data.main = './foo.js'
      return data
    }
  }
]
```

- __files__: One or more glob patterns.
- __handler__: The function we use to get new file contents. For `.json` we automatically parse and stringify it. Otherwise you will receieve raw string.

### `type: 'move'`

Move files in target directory.

```js
actions: [
  {
    type: 'move',
    patterns: {
      'index-*.js': 'index.js'
    }
  }
]
```

- __patterns__: Each entry can be a glob pattern which is supposed to matches __zero or one__ file in target directory.

### `type: 'remove'`

Remove files in target directory.

```js{3-4}
actions: [
  {
    type: 'remove',
    files: '**/*.ts',
    when: '!useTypescript'
  }
]
```

- __files__: The files to remove.
  - `string`: A glob pattern.
  - `string[]`: An array of glob patterns.
  - `object`: Each entry is a glob pattern, if the value is a string, then it will be evaluated in the context of `answers`.
  - `function`: Accepts `answers` as the only argument, and returns either of above types.

## Hooks

### `completed`

Executed when all actions are completed.

```js
module.exports = {
  async complete() {
    await this.gitInit()
    await this.npmInstall()
    this.showCompleteTips()
  }
}
```
