/* global argv, config */
const loadConfig = require('./utils/loadConfig');
const co = require('co');
const build = require('./commands/build');

module.exports = co.wrap(function* run () {
  global.config = yield loadConfig();
  switch (argv._[0]) {
    case 'b':
    case 'build':
      return yield build();
    default:
      throw new Error('Unknown options!');
  }
});
