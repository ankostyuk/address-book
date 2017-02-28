'use strict';

//
var path    = require('path'),
    langs   = require('../app/langs');

module.exports = function(options) {
    var cwd = options.path;

    return {
        langs: langs.translatableLangs,

        angular: {
            // add to repo ignore (.gitignore, ...)
            dstLocalesDir: path.resolve(cwd, 'i18n/angular/locales')
        },

        sources: [{
            // ui
            pattern:        '**/*.+(js|html)',
            inputDir:       path.resolve(cwd, 'src'),
            inputRootPath:  path.resolve(cwd, ''),
            outputDir:      path.resolve(cwd, 'i18n/sources/ui'),
            bundleDir:      path.resolve(cwd, 'i18n/bundles/ui')
        }, {
            // ui_keys
            mode:           'simple',
            pattern:        '**/*.txt',
            inputDir:       path.resolve(cwd, 'i18n/sources/ui_keys/src'),
            inputRootPath:  path.resolve(cwd, ''),
            outputDir:      path.resolve(cwd, 'i18n/sources/ui_keys'),
            bundleDir:      path.resolve(cwd, 'i18n/bundles/ui_keys')
        }]
    }
};
