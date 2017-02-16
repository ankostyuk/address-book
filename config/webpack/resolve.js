//
module.exports = function(options) {
    return {
        alias: {
            'app': options.path + '/src/app'
        },
        extensions: ['.js']
    };
};
