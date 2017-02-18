/**
 * @author ankostyuk
 */

var i18n    = require('i18n'),
    angular = require('angular');

var template = require('./views/lang-switch.html');

module.exports = angular.module('app.lang-switch', [])
    //
    .run([function() {
        template = i18n.translateTemplate(template);
    }])
    //
    .directive('appLangSwitch', ['i18nService', function(i18nService){
        return {
            restrict: 'A',
            template: template,
            scope: {},
            controller: ['$scope', function($scope) {
                angular.extend($scope, {
                    lang: i18nService.getLang(),
                    langUrls: i18nService.getLangUrls()
                }, i18n.translateFuncs);
            }]
        }
    }]);
//
