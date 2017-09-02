import path from 'path'
import test from 'ava'
import sao from '..'

test('simple template', async t => {
  const res = await sao.mockPrompt(
    {
      fromPath: path.join(__dirname, 'fixture/simple')
    },
    {
      test: false
    }
  )

  t.deepEqual(res.fileList, ['.gitignore', 'bar/bar.js', 'foo.js'])
  t.is(res.fileContents('foo.js'), 'no\n')
})

// Not a template (no sao.js), simply copy the whole root foler
test('non-template', async t => {
  const res = await sao.mockPrompt({
    fromPath: path.join(__dirname, 'fixture/non-template')
  })

  t.deepEqual(res.fileList, ['a.js', 'b.js'])
})

test('invalid prompt', async t => {
  await t.throws(
    sao.mockPrompt({
      fromPath: path.join(__dirname, 'fixture/invalid-prompt')
    }),
    'Validation failed at prompt: "name"'
  )
})

test('set default value of confirm', async t => {
  const res = await sao.mockPrompt({
    fromPath: path.join(__dirname, 'fixture/confirm')
  })
  t.deepEqual(res.meta.answers, {
    foo: true,
    bar: false
  })
})
