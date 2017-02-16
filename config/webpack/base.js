//
var path                = require('path'),
    webpack             = require('webpack'),
    ExtractTextPlugin   = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin   = require('html-webpack-plugin');

//
var ENV         = process.env.NODE_ENV,
    PRODUCTION  = ENV === 'production';

//
module.exports = function(options) {

    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: PRODUCTION,
            discardComments: {
                removeAll: PRODUCTION
            }
        }
    };

    return {
        entry: {
            app: options.path + '/src/app/app.js'
        },

        output: {
            path: options.path + '/dist/app',
            filename: 'js/[name].[chunkhash].js',
            publicPath: ''
        },

        resolve: require('./resolve')(options),

        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        failOnWarning: false,
                        failOnError: true
                    }
                }],
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract([cssLoader])
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract([cssLoader, 'less-loader'])
            }, {
                test: /\.(woff|woff2|svg)$/,
                loader: 'url-loader?name=static/[name].[hash].[ext]&limit=10000'
            }, {
                test: /\.(ttf|eot)$/,
                loader: 'file-loader?name=static/[name].[hash].[ext]'
            }, {
                test: /\.html$/,
                loader: 'raw-loader'
            }]
        },

        plugins: [
            new ExtractTextPlugin('css/[name].[chunkhash].css'),
            new HtmlWebpackPlugin({
                template: options.path + '/src/app/index.html',
                filename: 'index.html'
            }),
            new webpack.DefinePlugin({
                PRODUCTION: PRODUCTION
            })
        ].concat(PRODUCTION ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: true
                },
                comments: false
            })
        ] : [])
    };
};
