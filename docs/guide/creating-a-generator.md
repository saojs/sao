# Creating A Generator

A generator is essentially a directory which includes a `saofile.js`, let's make one now:

```bash
mkdir sample-generator
cd sample-generator
vim saofile.js
# or edit it with your editor of choice
```

You can use `saofile.js` to ask user questions in order to generate / move / modify files.

📝 __saofile.js__:

```js{8-13}
module.exports = {
  prompts: [
    {
      name: 'username',
      message: 'What is your name'
    }
  ],
  actions: [
    {
      type: 'add',
      files: '**'
    }
  ]
}
```

Note the highlighted lines, they will make SAO generate files from `./sample-generator/template/**` to the target directory. These files will also be rendered by [`ejs`](http://ejs.co/) using the answers of `prompts`.

You can now run this local generator to create a new project:

```bash
sao ./sample-generator new-project
```

<TerminalDemo url="https://cdn.rawgit.com/egoist/3464acbc4202569a837fac650ec495ba/raw/daaf3bded1c57c72f7052d2703579e5aed3f9344/sao-preview.svg" />

For a complete list of options in `saofile.js`, please check out [the config references](./saofile.md).
