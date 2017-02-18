/**
 * @author ankostyuk
 */

var i18n    = require('i18n'),
    angular = require('angular');

var template = require('./views/error-message.html');

module.exports = angular.module('app.error-message', [])
    //
    .run([function() {
        template = i18n.translateTemplate(template);
    }])
    //
    .directive('appErrorMessage', [function(){
        return {
            restrict: 'A',
            template: template,
            scope: {},
            controller: ['$scope', function($scope) {
                angular.extend($scope, {
                    // isShown: true,
                    hide: function() {
                        $scope.isShown = false;
                    }
                });
            }]
        }
    }]);
//
