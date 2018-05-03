module.exports = async (tpl, data) => {
  if (typeof tpl !== 'string') {
    throw new TypeError(
      `Expected a string in the first argument, got ${typeof tpl}`
    )
  }

  if (typeof data !== 'object') {
    throw new TypeError(
      `Expected an Object/Array in the second argument, got ${typeof data}`
    )
  }

  const re = /\[(.*?)\]/g

  return asyncReplace(tpl, re, async (_, key) => {
    let ret = data

    for (const prop of key.split('.')) {
      ret = ret ? ret[prop] : ''
      if (typeof ret === 'function') {
        ret = await ret()
      }
    }

    return ret || ''
  })
}

async function asyncReplace(str, re, replacer) {
  const fns = []
  str.replace(re, (_, ...args) => {
    fns.push(replacer(_, ...args))
    return _
  })
  const replacements = await Promise.all(fns)
  return str.replace(re, () => replacements.shift())
}
