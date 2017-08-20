'use strict'
const downloadRepo = require('download-git-repo')
const $ = require('shelljs')

exports.repo = function(parsed, dest, options) {
  return new Promise((resolve, reject) => {
    const repo = `${parsed.user}/${parsed.name}${parsed.version
      ? `#${parsed.version}`
      : ''}`
    $.rm('-rf', dest)
    downloadRepo(repo, dest, options, err => {
      if (err) return reject(err)
      resolve(dest)
    })
  })
}
