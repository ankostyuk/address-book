'use strict';

/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var templates = {
    'error-message': require('./views/error-message.html')
};

module.exports = angular.module('app.message.ui', [])
    //
    .run(['utils', function(utils) {
        utils.translateTemplates(templates);
    }])
    //
    .directive('appErrorMessage', ['$rootScope', 'appEvents', function($rootScope, appEvents) {
        return {
            restrict: 'A',
            template: templates['error-message'],
            scope: {},
            controller: ['$scope', function($scope) {
                _.extend($scope, {
                    isShown: false,
                    hide: function() {
                        $scope.isShown = false;
                    }
                });

                $rootScope.$on(appEvents['error'], function() {
                    // TODO support error object: function(e, error)
                    $scope.isShown = true;
                });
            }]
        };
    }]);
//
