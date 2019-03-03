var path = require('path');
var pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(pathToPhaser, 'dist/phaser.js');

module.exports = {
    mode: 'development',
    context: `${__dirname}/src/`,

    entry: {
        index: './index.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: 'bundle.js',
        library: 'bundle',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devServer: {
        contentBase: path.resolve(__dirname, './'),
        publicPath: '/dist/',
        host: '127.0.0.1',
        port: 8000,
        open: true,
        lazy: false
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            phaser: phaser
        }
    }
};
