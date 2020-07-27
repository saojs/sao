import path from 'path'
import { SAO } from '../../'

test('prompts', async () => {
  const sao = new SAO({
    generator: path.join(__dirname, 'fixtures'),
    mock: true,
  })

  await sao.run()

  expect(sao.answers).toEqual({
    name: 'my name',
    age: '',
  })
})
