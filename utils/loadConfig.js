/* global argv */
const path = require('path');
const babel = require('babel-core');
const exists = require('path-exists');
const requireFromString = require('require-from-string');

module.exports = function (file) {
  file = argv.config || argv.c || 'sao.config.js';
  file = path.join(process.cwd(), file);
  if (!exists.sync(file)) {
    return log.error('Config file not found');
  }
  return new Promise((resolve, reject) => {
    babel.transformFile(file, {}, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(requireFromString(result.code));
    });
  });
};
