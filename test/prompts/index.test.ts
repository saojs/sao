import os from 'os'
import path from 'path'
import { SAO } from '../../src/index'

const outDir = path.join(os.tmpdir(), `sao-out/${Date.now()}`)

test('prompts', async () => {
  const sao = new SAO({
    generator: path.join(__dirname, 'fixtures'),
    outDir: outDir,
    mock: true,
  })

  await sao.run()

  expect(sao.answers).toEqual({
    name: 'my name',
    age: undefined,
  })
})
