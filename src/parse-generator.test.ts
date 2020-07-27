import os from 'os'
import { parseGenerator, ParsedGenerator } from './parse-generator'

const parse = (name: string): ParsedGenerator => {
  const result = parseGenerator(name)
  return {
    ...result,
    path: result.path
      .replace(os.homedir(), '~')
      // Replace back slashes with slashes (for Windows)
      .replace(/\\/g, '/'),
  }
}

test('parseGenerator', () => {
  // GitHub repo
  expect(parse(`egoist/poi`)).toMatchInlineSnapshot(`
    Object {
      "hash": "e66c30fe",
      "path": "~/.sao/V2/repos/e66c30fe",
      "prefix": "github",
      "repo": "poi",
      "subGenerator": undefined,
      "type": "repo",
      "user": "egoist",
      "version": "master",
    }
  `)
  // GitHub repo with version
  expect(parse(`egoist/poi#v1.0.0`)).toMatchInlineSnapshot(`
    Object {
      "hash": "6e0c0844",
      "path": "~/.sao/V2/repos/6e0c0844",
      "prefix": "github",
      "repo": "poi",
      "subGenerator": undefined,
      "type": "repo",
      "user": "egoist",
      "version": "v1.0.0",
    }
  `)
  // Npm package
  expect(parse(`nm`)).toMatchInlineSnapshot(`
    Object {
      "hash": "096eb1e0",
      "name": "sao-nm",
      "path": "~/.sao/V2/packages/096eb1e0/node_modules/sao-nm",
      "slug": "sao-nm",
      "subGenerator": undefined,
      "type": "npm",
      "version": "latest",
    }
  `)
  // Npm package with version
  expect(parse(`nm@2.0.1`)).toMatchInlineSnapshot(`
    Object {
      "hash": "545f7d07",
      "name": "sao-nm",
      "path": "~/.sao/V2/packages/545f7d07/node_modules/sao-nm",
      "slug": "sao-nm@2.0.1",
      "subGenerator": undefined,
      "type": "npm",
      "version": "2.0.1",
    }
  `)
  // Scoped Npm package
  expect(parse(`@egoist/nm`)).toMatchInlineSnapshot(`
    Object {
      "hash": "427e6ec2",
      "name": "@egoist/sao-nm",
      "path": "~/.sao/V2/packages/427e6ec2/node_modules/@egoist/sao-nm",
      "slug": "@egoist/sao-nm",
      "subGenerator": undefined,
      "type": "npm",
      "version": "latest",
    }
  `)
  // Scoped Npm package with version
  expect(parse(`@egoist/nm@2.0.1`)).toMatchInlineSnapshot(`
    Object {
      "hash": "5ff93739",
      "name": "@egoist/sao-nm",
      "path": "~/.sao/V2/packages/5ff93739/node_modules/@egoist/sao-nm",
      "slug": "@egoist/sao-nm@2.0.1",
      "subGenerator": undefined,
      "type": "npm",
      "version": "2.0.1",
    }
  `)
  // prefix
  expect(parse(`gitlab:egoist/poi`)).toMatchInlineSnapshot(`
    Object {
      "hash": "766eaa60",
      "path": "~/.sao/V2/repos/766eaa60",
      "prefix": "gitlab",
      "repo": "poi",
      "subGenerator": undefined,
      "type": "repo",
      "user": "egoist",
      "version": "master",
    }
  `)
  // Remove sao- pefix
  expect(parse(`sao-nm`)).toMatchInlineSnapshot(`
    Object {
      "hash": "096eb1e0",
      "name": "sao-nm",
      "path": "~/.sao/V2/packages/096eb1e0/node_modules/sao-nm",
      "slug": "sao-nm",
      "subGenerator": undefined,
      "type": "npm",
      "version": "latest",
    }
  `)
})
