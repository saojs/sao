import path from 'path'
import { SAO } from '../../'

test('use default saofile', async () => {
  const sao = new SAO({
    generator: path.join(__dirname, 'fixtures'),
    mock: true,
  })

  await sao.run()

  expect(await sao.getOutputFiles()).toMatchInlineSnapshot(`
    Array [
      "foo.txt",
    ]
  `)
  expect(await sao.readOutputFile('foo.txt')).toBe('foo\n')
})
