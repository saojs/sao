'use strict'
const fetch = require('node-fetch')
const requireString = require('require-from-string')

module.exports = function (url) {
  function validStatus(code) {
    return code >= 200 && code < 300
  }
  return fetch(url)
    .then(res => {
      if (validStatus(res.status)) {
        return res.text()
      }
      throw new Error(`${res.status}: ${res.statusText}`)
    })
    .then(text => requireString(text))
}
