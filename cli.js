#!/usr/bin/env node
require('colorful').toxic();
global.log = require('typelog');
global.argv = require('minimist')(process.argv.slice(2), { '--': true });
// run cli
require('./')()
  .catch(err => console.log(err));
