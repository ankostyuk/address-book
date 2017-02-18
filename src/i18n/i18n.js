/**
 * @author ankostyuk
 */

var Uri         = require('jsuri'),
    _           = require('lodash'),
    angular     = require('angular'),
    i18n        = require('i18n'),
    i18nConfig  = require('i18n-config');

var root        = window,
    location    = document.location,
    locationUri = new Uri(location.href),
    appId       = CONFIG['app.id'],
    localConfig = {};

function checkLocalConfig() {
    var localStorageItem = root.localStorage && root.localStorage.getItem(appId);

    localConfig = null;

    try {
        localConfig = JSON.parse(localStorageItem);
    } catch(e) {
        console.error(e);
    }

    localConfig = localConfig || {};
}

function storeLocalConfig() {
    if (root.localStorage) {
        root.localStorage.setItem(appId, JSON.stringify(localConfig));
    }
}

function checkLang() {
    checkLocalConfig();
    localConfig['lang'] = locationUri.getQueryParamValue('lang') || localConfig['lang'] || i18nConfig.defaultLang;
    storeLocalConfig();
}

function getLang() {
    return localConfig['lang'];
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

module.exports = angular.module('i18n', [])
    //
    .service('i18nService', [function() {
        //
        var langUrls = [];

        _.each(i18nConfig.langs, function(lang) {
            var langUri = new Uri(location.href);
            langUri.deleteQueryParam('lang').addQueryParam('lang', lang);
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
        }
    }]);
//
