/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var templates = {
    'user-info': require('./views/user-info.html')
}

//
module.exports = angular.module('app.user.ui', [])
    //
    .run(['utils', function(utils) {
        utils.translateTemplates(templates);
    }])
    //
    .directive('appUserInfo', ['$rootScope', 'securityService', 'appEvents', function($rootScope, securityService , appEvents) {
        return {
            restrict: 'A',
            template: templates['user-info'],
            scope: {},
            controller: ['$scope', function($scope) {
                _.extend($scope, {
                    logout: function() {
                        securityService.logout();
                    }
                });

                $rootScope.$on(appEvents['app.user'], function(e, user) {
                    $scope.user = user;
                });
            }]
        }
    }]);
//
