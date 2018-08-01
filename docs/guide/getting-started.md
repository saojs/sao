# Getting Started

## Installation

SAO is a CLI library writen in JavaScript, so you can install it from npm:

```bash
npm i -g sao@next
```

Alternatively, a lot of you may use Yarn instead:

```bash
yarn global add sao@next
```

Note that SAO 1.0 is currently in beta, it is published at `next` channel on npm registry.

Then try the command `sao -v` in your terminal, if everything works fine you'd see a version number.

## Using a generator

```bash
sao nm my-project
```

By running this command, SAO will install a generator which is [sao-nm](https://npm.im/sao-nm) from npm in `~/.sao/packages` and use it to generate files into `my-project` directory.

If you want it to generate into current directoy, just omit the second argument: `sao nm`.

A generator could be either:

- __Local directory__, e.g. `sao ./path/to/my-generator`
- __An npm package__, e.g. `sao react` will be package `sao-react`.
  - To use an npm package that does not follow the `sao-*` naming convention, just prefix the name like this: `sao npm:foo`, then it will use the `foo` package instead of `sao-foo`.
- __A git repository__, e.g. `sao egoist/sao-nm` will use `github.com/egoist/sao-nm`, you can use following prefixes for other git hosts:
  - `gitlab:` For GitLab.
  - `bitbucket:` For BitBucket.

## Sub generators

A generator might have sub generators, you can run them like this:

```bash
sao nm:circleci
```

Run the `circleci` generator of the `nm` generator to generate a `circle.yml` in current directory.
