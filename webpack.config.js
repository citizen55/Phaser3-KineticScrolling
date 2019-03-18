'use strict';

const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    context: `${__dirname}/src/`,

    entry: {
        KineticScrolling: './main.js',
        'KineticScrolling.min': './main.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'KineticScrolling'
       // libraryTarget: 'umd',
       // umdNamedDefine: true
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [
              /node_modules/,
            ],
          },
        ],
    }

    // , plugins: [

    //     new UglifyJSPlugin({
    //         include: /\.min\.js$/,
    //         parallel: true,
    //         sourceMap: false,
    //         uglifyOptions: {
    //             compress: true,
    //             ie8: false,
    //             ecma: 5,
    //             output: {
    //                 comments: false
    //             },
    //             warnings: false
    //         },
    //         warningsFilter: (src) => false
    //     })
    // ]
};
