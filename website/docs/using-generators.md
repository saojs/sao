---
title: Using Generators
---

```bash
sao nm my-project
```

By running this command, SAO will install a generator which in this case is [sao-nm](https://npm.im/sao-nm) from npm, and use it to generate files into `my-project` directory.

If you want it to generate into current directoy, just omit the second argument like this: `sao nm`.

A generator could be one of:

- **Local directory**, e.g. `sao ./path/to/my-generator`
- **An npm package**, e.g. `sao react` will be package `sao-react`.
  - To use an npm package that does not follow the `sao-*` naming convention, just prefix the name like this: `sao npm:foo`, then this will use the `foo` package instead of `sao-foo`.
- **A git repository**, e.g. `sao egoist/sao-nm` will use `github.com/egoist/sao-nm`, you can use following prefixes for other git providers:
  - `gitlab:` For GitLab. e.g. `sao gitlab:user/my-generator`
  - `bitbucket:` For BitBucket. e.g. `sao bitbucket:user/my-generator`
  - `direct:` For a git repository anywhere else `sao direct:git@yourowngitrepo.com:user/my-generator.git`

## Versioning

For npm package, you can use a specific verison of the generator:

```bash
sao nm@1
sao nm@0.2
```

The syntax here is the same as `npm install`.

For git repository, you can use a specific tag, commit or branch of the generator:

```bash
sao nm#dev
sao nm#v1.0.0
```

## Sub-generators

A generator might have sub-generators, you can run them like this:

```bash
sao nm:donate
```

The part after `:` is a sub-generator called `donate`, by running this command SAO will run the sub-generator which will add a `postinstall` script in `package.json` to show donation URL.

:::caution
Sub-generators are supposed to be run in an existing project, which means the output directory is always current working directory.
:::

## Update Cached Generator

Once you've run a generator, it will be cached locally in `~/.sao` directory. To run the same generator with an up-to-date version, you can add the `--update` or `-u` flag.
