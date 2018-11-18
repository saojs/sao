const Conf = require('conf')
const logger = require('./logger')
const { SAO_GLOBAL_SCOPE } = require('./env')

const store = new Conf({
  configName: SAO_GLOBAL_SCOPE
})

logger.debug('Store path:', store.path)

module.exports = store
