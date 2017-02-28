'use strict';

//
var fs      = require('fs-extra'),
    path    = require('path'),
    _       = require('lodash'),
    async   = require('async'),
    i18n    = require('nullpointer-i18n-bin');

//
var pwd     = process.env.PWD;

var opts = {
    path: pwd
};

var config      = require('./config')(opts),
    langs       = config.langs,
    baseLang    = config.langs[0];

console.info('- i18n build... langs:', langs, '\n');

// i18n
console.info('-- gettext *.po and json-bundle...', '\n');
async.eachSeries(config.sources, function(options, done) {
    i18n.run(_.extend({}, options, {
        baseLang: baseLang,
        langs: langs
    }), done);

}, function(error) {
    console.info('\n...done', '\n');
    copyAngularLocale();
});

// angular locale
function copyAngularLocale() {
    var ngConfig = config.angular;

    console.info('-- copy angular locale files to', ngConfig.dstLocalesDir, '...');

    fs.emptyDirSync(ngConfig.dstLocalesDir);

    _.each(langs, function(lang) {
        var localeFile = 'angular-locale_' + lang + '.js';
        fs.copySync(
            path.resolve(
                pwd, 'node_modules/angular-i18n/', localeFile
            ),
            path.resolve(
                ngConfig.dstLocalesDir, localeFile
            )
        );
    });

    console.info('...done', '\n');
}
