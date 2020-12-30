---
title: Creating Generators
---

SAO provides a generator for creating a new generator:

```bash
sao generator sao-sample
# Make sure to replace `sao-sample` with your desired generator name
```

## Folder Structure

The basic folder structure is as follows:

```bash
.
├── LICENSE
├── README.md
├── circle.yml
├── package.json
├── saofile.js
├── template
│   ├── LICENSE
│   ├── README.md
│   └── gitignore
├── test
│   └── test.js
└── yarn.lock # Or package-lock.json if you don't have Yarn on your machine
```

📝 **saofile.js**:

```js
const superb = require('superb')

module.exports = {
  prompts() {
    return [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new project',
        default: this.outFolder,
        result: (val) => val.toLowerCase(),
      },
      {
        type: 'input',
        name: 'description',
        message: 'How would you descripe the new project',
        default: `my ${superb()} project`,
      },
      {
        type: 'input',
        name: 'username',
        message: 'What is your GitHub username',
        default: this.gitUser.username || this.gitUser.name,
        result: (val) => val.toLowerCase(),
        store: true,
      },
      {
        type: 'input',
        name: 'email',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true,
      },
      {
        type: 'input',
        message: 'The URL of your website',
        default({ username }) {
          return `github.com/${username}`
        },
        store: true,
      },
    ]
  },
  actions: [
    {
      type: 'add',
      // Copy and transform all files in `template` folder into output directory
      files: '**',
    },
    {
      type: 'move',
      patterns: {
        gitignore: '.gitignore',
      },
    },
  ],
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()
  },
}
```

- `prompts`: CLI prompts to retrive answers from current user.
- `actions`: A series of actions to manipulate files.
- `completed`: A function that will be invoked when the whole process is finished.

Now you can run the generator to generate a new project:

```bash
sao ../sao-sample new-project
```

Note that if no `saofile.js` was found in the generator, SAO will use a [default one](https://github.com/saojs/sao/blob/master/lib/saofile.fallback.js) which would simply copy all files into output directory.

## Access SAO Instance

If you want to access the instance you can use `actions` `prompts` as `function`, the SAO instance will be available as `this` in the function:

```js
module.exports = {
  prompts() {
    return [
      {
        type: 'input',
        name: 'author',
        message: 'What is your name',
        // Use the value of `git config --global user.name` as the default value
        default: this.gitUser.name,
      },
    ]
  },
  // ...
}
```

For a complete list of options in `saofile.js`, please check out [GeneratorConfig References](api/interfaces/generatorconfig.md).
