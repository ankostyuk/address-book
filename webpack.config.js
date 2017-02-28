'use strict';

//
var _ = require('lodash');

var configs = {
    base: require(__dirname + '/config/webpack/base'),
    dev: require(__dirname + '/config/webpack/env/dev'),
    production: require(__dirname + '/config/webpack/env/production'),
};

function init() {
    var env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

    var opts = {
        path: __dirname
    };

    var config = _.merge(
        configs.base(opts),
        configs[env](opts)
    );

    return config;
}

module.exports = init();
