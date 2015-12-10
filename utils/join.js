const path = require('path');

module.exports = function (file) {
  return path.join(process.cwd(), file);
};
