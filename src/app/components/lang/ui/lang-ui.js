'use strict';

/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    i18n    = require('i18n'),
    angular = require('angular');

var templates = {
    'lang-switch': require('./views/lang-switch.html')
};

module.exports = angular.module('app.lang.ui', [])
    //
    .run(['utils', function(utils) {
        utils.translateTemplates(templates);
    }])
    //
    .directive('appLangSwitch', ['i18nService', function(i18nService){
        return {
            restrict: 'A',
            template: templates['lang-switch'],
            scope: {},
            controller: ['$scope', function($scope) {
                _.extend($scope, {
                    lang: i18nService.getLang(),
                    langUrls: i18nService.getLangUrls()
                }, i18n.translateFuncs);
            }]
        };
    }]);
//
