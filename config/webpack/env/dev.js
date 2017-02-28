'use strict';

//
module.exports = function(options) {

    return {
        context: options.path,
        devtool: 'eval',
        devServer: {
            contentBase: './dist/app', // TODO
            stats: 'normal',
            hot: false,
            inline: true,
            port: 8090
        }
    };
};
