/* global argv, config */
const co = require('co');
const mkdirp = require('mkdirp');
const path = require('path');
const pify = require('pify');
const jade = require('jade');
const join = require('../utils/join')
const mkdir = pify(mkdirp);

module.exports = co.wrap(function* () {
  // create essential folders
  yield mkdir(join('docs'));
  for (var i in config.langs) {
    if (config.langs[i]) {
      yield mkdir(join('docs/' + i));
    }
  }
  // bundle js
  if (!argv.html) {
    b.add(path.join(__dirname, '../templates/js/app.js'));
    const jsFile = yield pify(b.bundle)();
    console.log(jsFile)
  }
  // build docs/index.html

});
