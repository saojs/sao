module.exports = {
  entry: ['./templates/src/index'],
  output: {
    path: __dirname + '/templates/js',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: [/node_modules/] }
    ]
  },
  plugins: []
}
