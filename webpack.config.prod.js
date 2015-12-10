var webpack = require('webpack')
var config = require('./webpack.config')
var path = require('path')

config.plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    '__DEV__': false,
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    },
    output: {
      comments: false
    }
  })
]

module.exports = config
