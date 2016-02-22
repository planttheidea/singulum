var path = require("path"),
    webpack = require("webpack"),
    defaultConfig = require("./webpack.config"),
    config = Object.assign({}, defaultConfig, {
        entry:[
            path.resolve(__dirname, "public/AsyncApp")
        ]
    });

module.exports = config;