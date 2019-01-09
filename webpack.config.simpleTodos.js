var path = require('path'),
  defaultConfig = require('./webpack.config'),
  config = Object.assign({}, defaultConfig, {
    entry: [path.resolve(__dirname, 'public/simpleTodos')]
  });

module.exports = config;
