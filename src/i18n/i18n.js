'use strict';

/**
 * @author ankostyuk
 */

var Uri             = require('jsuri'),
    _               = require('lodash'),
    angular         = require('angular'),
    clientStorage   = require('client-storage/client-storage'),
    i18n            = require('i18n'),
    i18nConfig      = require('i18n-config');

var location        = document.location,
    locationUri     = new Uri(location.href),
    langParamName   = 'lang';

//
function checkLang() {
    var lang = locationUri.getQueryParamValue(langParamName) || clientStorage.getItem(langParamName);

    if (!_.includes(i18nConfig.langs, lang)) {
        lang = i18nConfig.defaultLang;
    }

    clientStorage.setItem(langParamName, lang);
}

function getLang() {
    return clientStorage.getItem(langParamName);
}

function loadAngularLocale(lang) {
    return require('i18n-angular/locales/angular-locale_' + lang);
}

function setupLang() {
    checkLang();

    var lang = getLang();

    loadAngularLocale(lang);

    i18n.setConfig(i18nConfig['i18n-component']);
    i18n.setBundle(i18nConfig['bundles']);
    i18n.setLang(lang);
}

setupLang();

//
module.exports = angular.module('i18n', [])
    //
    .service('i18nService', [function() {
        //
        var langUrls = [];

        _.each(i18nConfig.langs, function(lang) {
            var langUri = new Uri(location.href);
            langUri.deleteQueryParam(langParamName).addQueryParam(langParamName, lang);
            langUrls.push({
                lang: lang,
                url: langUri.toString()
            });
        });

        //
        this.getLang = getLang;

        //
        this.getLangUrls = function() {
            return langUrls;
        };
    }]);
//
