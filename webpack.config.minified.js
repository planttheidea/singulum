var path = require('path'),
  webpack = require('webpack'),
  defaultConfig = require('./webpack.config'),
  productionConfig = Object.assign({}, defaultConfig, {
    entry: [path.resolve(__dirname, 'src/index')],

    mode: 'production',

    output: Object.assign({}, defaultConfig.output, {
      filename: 'dist/singulum.min.js'
    })
  });

delete productionConfig.devtool;

module.exports = productionConfig;
