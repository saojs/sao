var webpack = require('webpack')
var config = require('./webpack.config')
var path = require('path')

config.debug = true
config.devtool = 'source-map'
config.plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    '__DEV__': true,
    'process.env': JSON.stringify('development')
  })
]

module.exports = config
