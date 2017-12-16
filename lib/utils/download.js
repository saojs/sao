'use strict'
const fs = require('fs-extra')
const downloadRepo = require('download-git-repo')

function download(repo, dest, options) {
  return new Promise((resolve, reject) => {
    downloadRepo(repo, dest, options, err => {
      if (err) return reject(err)
      resolve(dest)
    })
  })
}

exports.repo = function(parsed, dest, options) {
  return fs.remove(dest).then(() => {
    const repo = `${parsed.user}/${parsed.name}${
      parsed.version ? `#${parsed.version}` : ''
    }`
    return download(repo, dest, options)
  })
}
