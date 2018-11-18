const Conf = require('conf')
const logger = require('./logger')

let store

const init = configName => {
  store = store = new Conf({ configName })
  logger.debug('Store path:', store.path)
}

module.exports = store
module.exports.init = init
