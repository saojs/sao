const test = require('ava')
const isLocalPath = require('../isLocalPath')

test('works', t => {
  t.true(isLocalPath('./ff'))
  t.true(isLocalPath('/ff'))
  t.true(isLocalPath('c:///ff'))
  t.false(isLocalPath('ff'))
})
