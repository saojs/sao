## Basic Usage

```bash
sao nm my-project
```

Running this command will download the generator from npm ([sao-nm](npm.im/sao-nm)) and generate a new project to `./my-project` directory.

You can also use any GitHub repo:

```bash
sao egoist/graphql-api-starter new-project
```

When the generator does not include a file called `saofile.js`, SAO will simply copy it to output directory. In this case it works kinda like `git clone` but without git history and the generator will be cached locally.

## Authoring Generators

Starting by creating a new folder, let's call it `sao-npm` because we want to use it to scaffold out a npm package. Then create a `saofile.js` inside the folder:

```js
module.exports = {
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of this package',
    },
    {
      type: 'input',
      name: 'description',
      message: 'How would you describe this package',
    },
  ],
  actions: [
    {
      type: 'add',
      files: '**',
    },
  ],
}
```

Here we use `prompts` to ask users some questions and retrieve answers as an object which looks like `{ name: '..', description: '...' }`.

Next we use `actions` to define a series of actions, the `add` action will copy `files` from `sao-npm/template/` to the output directory.

Now let's create some template files, for example, `template/package.json`:

```json
{
  "name": "<%= name %>",
  "description": "<%= description %>",
  "version": "0.0.0"
}
```

Template files supports [ejs](https://ejs.co) template engine, and the anwers we retrieved will be available here as local variable.

### Prompts

`prompts` is a list of questions you want the user to answer.

Each `prompt` object has a `type` property, which can be either:

- `"input" | "invisible" | "list" | "password" | "text"`: [StringPromptOptions](/typedoc/interfaces/stringpromptoptions.html)
- `"confirm"`: [BooleanPromptOptions](/typedoc/interfaces/booleanpromptoptions.html)
- `"autocomplete" | "editable" | "form" | "multiselect" | "select" | "survey" | "list" | "scale"`: [ArrayPromptOptions](/typedoc/interfaces/arraypromptoptions.html)

Check out the [GeneratorConfig['prompts']](/typedoc/interfaces/generatorconfig.html#prompts) type for details.

## Testing Generators

Using the testing framework [Jest](https://jestjs.io/) as example:

```js
import { SAO } from 'sao'

test('it works', () => {
  const sao = new SAO({
    generator: '/absolute/path/to/your/generator',
    // `mock` make SAO run in mock mode
    // then it will use default value for prompts
    // It defaults to `process.env.NODE_ENV === 'test'`
    // if it's not specified explicitly
    mock: true
  })

  await sao.run()

  expect(sao.answers).toEqual({
    answerA: true,
    answerB: 'foo'
  })
  expect(await sao.getOutputFiles()).toEqual([
    'a.js',
    'b.js'
  ])
  expect(await sao.readOutputFile('foo.js')).toBe(`const foo = 'foo'`)
})
```

Setting the option `mock` to `true` or setting `process.env.NODE_ENV` to `test` will make SAO run in mock mode:

- All prompts will use default value instead of asking user for input, you can also pass a custom `answers` object if you want.
- Use mocked value for git user information.
- Logger won't output text to terminal, instead they're saved to `sao.logger.lines`
- `outDir` will be a random temporary directory.

### Testing Prompts

By setting `mock: true` you are essentially making all prompts use their default values, however you can provide custom `answers`:

```js
const sao = new SAO({
  generator: '/absolute/path/to/your/generator',
  mock: true,
  answers: {
    unitTest: true,
  },
})
```

With above code you can test if you generator works properly when the answer of `unitTest` is `true`
