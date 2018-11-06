const Conf = require('conf')
const logger = require('./logger')

const store = new Conf()

logger.debug('Store path:', store.path)

module.exports = store
