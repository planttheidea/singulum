var fs = require('fs'),
  path = require('path'),
  webpack = require('webpack'),
  packageJson = fs.readFileSync('package.json'),
  packageJsonParsed = JSON.parse(packageJson),
  banner = '';

banner += 'Library: ' + packageJsonParsed.name + '\n';
banner += 'Description: ' + packageJsonParsed.description + '\n';
banner += 'Author: ' + packageJsonParsed.author + '\n';
banner += 'Version: ' + packageJsonParsed.version + '\n';
banner += 'License: ' + packageJsonParsed.license;

module.exports = {
  devtool: '#cheap-module-eval-source-map',

  entry: [path.resolve(__dirname, 'src/index')],

  mode: 'development',

  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: /.idea|dist|node_modules/,
        loader: 'eslint-loader',
        options: {
          configFile: './.eslintrc',
          emitError: true,
          failOnError: true,
          failOnWarning: false,
          formatter: require('eslint-friendly-formatter')
        },
        test: /\.js$/
      },
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.(js|jsx)?$/
      }
    ]
  },

  output: {
    filename: 'dist/singulum.js',
    library: 'singulum',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || '"development"')
        }
      }
    }),
    new webpack.BannerPlugin(banner)
  ]
};
