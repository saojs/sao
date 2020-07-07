import os from 'os'
import path from 'path'
import { SAO } from '../../src/index'

const outDir = path.join(os.tmpdir(), `sao-out/${Date.now()}`)

test('use default saofile', async () => {
  const sao = new SAO({
    generator: path.join(__dirname, 'fixtures'),
    outDir: outDir,
    mock: true,
  })

  await sao.run()

  expect(await sao.getOutputFiles()).toMatchInlineSnapshot(`
    Array [
      "foo.txt",
    ]
  `)
  expect(await sao.readOutDir('foo.txt')).toBe('foo\n')
})
