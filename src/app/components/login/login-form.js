/**
 * @author ankostyuk
 */

var i18n    = require('i18n'),
    angular = require('angular');

var template = require('./views/login-form.html');

module.exports = angular.module('app.login-form', [])
    //
    .run([function() {
        template = i18n.translateTemplate(template);
    }])
    //
    .directive('appLoginForm', [function(){
        return {
            restrict: 'A',
            template: template,
            scope: {},
            link: function(scope, element, attrs) {
                scope.isShown = false;
            }
        }
    }]);
//
