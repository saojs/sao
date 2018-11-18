const SAO_GLOBAL_SCOPE = process.env.SAO_GLOBAL_SCOPE || 'sao'
const SAO_MODULE_PREFIX = process.env.SAO_MODULE_PREFIX || 'sao'
const SAO_CONFIG_FILE = process.env.SAO_CONFIG_FILE || 'saofile'

module.exports = {
  SAO_GLOBAL_SCOPE,
  SAO_MODULE_PREFIX,
  SAO_CONFIG_FILE
}
