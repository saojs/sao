const test = require('ava')
const evaluate = require('../evaluate')

test('works', t => {
  t.is(evaluate('foo', { foo: 'hehe' }), 'hehe')
})
