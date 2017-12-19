var httpServiceOpen = true;

var private_config = null;
try{
    private_config = './private_config/private.config.json'
    private_config = require(private_config);
}catch(e){
    private_config = null;
    // console.log(e);
}

var ToolsContainer = require('./tools.config.js');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var SftpWebpackPlugin = require('sftp-webpack-plugin')

var webpack_config = {
    entry: {
        index: './front-src/entry/index.ts',
    },
    output: {
        path: __dirname + '/dest/deploy/', // 输出文件的保存路径
        filename: '[name].entry.js' // 输出文件的名称
    },
    module: {
        loaders: [{
            test: /\.(js)$/,
            loaders: 'babel-loader?presets[]=es2015'
        }, {
            test: /\.(ts)$/,
            loaders: 'ts-loader'
        // }, {    
        //     test: /\.(ts)$/,
        //     loaders: 'awesome-typescript-loader'
        }, {
            test: /\.(css)$/,
            loaders: 'style-loader!css-loader!postcss-loader'
        }, {
            test: /\.(scss|sass)$/,
            loaders: 'style-loader!css-loader!postcss-loader!sass-loader'
        }, {
            test: /\.(png|jpg|jpeg|txt|mp3)$/,
            loaders: ToolsContainer.getDependencies('urlPathLoader')
                // loaders: 'file-loader'
        }, {
            test: /\.html$/,
            loaders: 'html-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.js' ]
    },
    plugins: [
        new CleanWebpackPlugin([__dirname + '/dest/deploy/'], {
            root: '', // An absolute path for the root  of webpack.config.js
            verbose: true, // Write logs to console.
            dry: false // Do not delete anything, good for testing.
        })
    ],
    externals: {
        'createjs': 'createjs',
        'Zepto': 'Zepto',
        '$': '$',
        'ndgmr': 'ndgmr'
    }
}
process.argv.forEach((argv) => {
    if (argv === '-p') {
        deploy();
        httpServiceOpen = false;
    }
})
// deploy();
function deploy() {
    if (private_config && private_config.SftpWebpackPlugin.open === true) {
        webpack_config.plugins.push(new SftpWebpackPlugin({
            port: private_config.SftpWebpackPlugin.port,
            host: private_config.SftpWebpackPlugin.host,
            username: private_config.SftpWebpackPlugin.username,
            password: private_config.SftpWebpackPlugin.password,
            from: __dirname + '/dest/deploy/',
            to: private_config.SftpWebpackPlugin.to
        }))
    }
}

module.exports = webpack_config;

if (httpServiceOpen) {
    var express = require('express');
    var bodyParser = require('body-parser')
    var app = express();

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(express.static('dest'));
    var server = app.listen(3000, function() {
        console.log('Listening on port %d', server.address().port);
    });
}

