//
var path = require('path');

module.exports = function(options) {
    return {
        alias: {
            'dummy': path.resolve(options.path, 'src/dummy'), // TODO remove if no prototype
            'info': path.resolve(options.path, 'src/info'),
            'client-storage': path.resolve(options.path, 'src/client-storage'),
            'i18n-angular': path.resolve(options.path, 'i18n/angular'),
            'i18n-config': path.resolve(options.path, 'i18n/app/config'),
            'i18n-app': path.resolve(options.path, 'src/i18n'),
            'i18n': 'nullpointer-i18n/i18n',
            'utils': path.resolve(options.path, 'src/utils'),
            'commons-angular': 'nullpointer-commons/src/angular',
            'template-utils': 'nullpointer-commons/src/utils/template-utils/template-utils',
            'app': path.resolve(options.path, 'src/app')
        },
        extensions: ['.js']
    };
};
