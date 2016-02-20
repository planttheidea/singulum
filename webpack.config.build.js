var path = require("path"),
    webpack = require("webpack"),
    defaultConfig = require("./webpack.config"),
    productionConfig = Object.assign({}, defaultConfig, {
        entry:[
            path.resolve(__dirname, "src/index")
        ],

        output: Object.assign({}, defaultConfig.output, {
            filename:"dist/singulum.js"
        })
    });

delete productionConfig.devtool;

module.exports = productionConfig;