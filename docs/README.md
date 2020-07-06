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
