# Create A Generator

A generator is essentially a directory which includes a `saofile.js`, let's make one now:

```bash
mkdir sample-generator
cd sample-generator
vim saofile.js
# or edit it with your editor of choice
```

You can use `saofile.js` to ask user questions in order to generate / move / modify file.

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

Notice the highlighted lines, this will make SAO generate files from `./sample-generator/template/**` to the `new-project` directory you specified in the below command. These files will also be rendered by [`ejs`](http://ejs.co/) using the answers of `prompts`.

You can now run this local generator to create a new project:

```bash
sao ./sample-generator new-project
```

For a complete list of options in `saofile.js`, please check out [this guide](./saofile.md).
