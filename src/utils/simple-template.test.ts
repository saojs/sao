import { renderSimpleTemplate } from "./simple-template"

test('simple template', () => {
  expect(renderSimpleTemplate(`hello {foo} {bar}`, {foo: 'world', bar: '!'})).toBe('hello world !')
})
