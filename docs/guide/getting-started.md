# Getting Started

To install it globally:

```bash
npm i -g sao
```

::: danger
For now, install `sao-next` instead since it's WIP.
:::

## Run a generator

```bash
sao nm my-project
```

By running this command, SAO will install `sao-nm` in `~/.sao/packages` and generate files into `my-project` directory.

If you want it to generate into current directoy, just omit the second argument: `sao nm`.

A generator could be either:

- __Local path__, e.g. `sao ./path/to/my-generator`
- __An npm package__, e.g. `sao react` will be package `sao-react`.
  - To use a package that does not follow the `sao-*` naming convention, just prefix the name like this: `sao npm:foo`, then it will use the `foo` package instead of `sao-foo`.
- __A git repository__, e.g. `sao egoist/sao-nm` will use `githb.com/egoist/sao-nm`, you can use follwing prefixes for other git hosts:
  - `gitlab:` For GitLab.
  - `bitbucket:` For BitBucket.

## Sub generators

A generator might have sub generators, you can run them like this:

```bash
sao nm:circleci
```

Run the `circleci` generator of the `nm` generator to generate a `circle.yml` in current directory.

Note that this is still an __exprimental__ feature.
