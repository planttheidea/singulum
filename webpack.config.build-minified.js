var path = require("path"),
    webpack = require("webpack"),
    defaultConfig = require("./webpack.config"),
    productionConfig = Object.assign({}, defaultConfig, {
        cache:false,

        debug:false,

        entry:[
            path.resolve(__dirname, "src/index")
        ],

        output: Object.assign({}, defaultConfig.output, {
            filename:"dist/singulum.min.js"
        }),

        plugins:defaultConfig.plugins.concat([
            new webpack.optimize.UglifyJsPlugin({
                compress:{
                    booleans:true,
                    conditionals:true,
                    drop_console:true,
                    drop_debugger:true,
                    join_vars:true,
                    screw_ie8:true,
                    sequences:true,
                    warnings:false
                },
                mangle:true,
                sourceMap:false
            })
        ])
    });

delete productionConfig.devtool;

module.exports = productionConfig;