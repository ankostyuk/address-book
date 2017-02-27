/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

//
module.exports = angular.module('app.helper', [])
    //
    .constant('appHandledHttpErrors', [400, 401, 422])
    //
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(['$log', '$q', '$rootScope', 'appEvents', 'appErrors', 'appHandledHttpErrors', function($log, $q, $rootScope, appEvents, appErrors, appHandledHttpErrors) {

            function responseErrorHandler(rejection) {
                if (!_.includes(appHandledHttpErrors, rejection.status)) {
                    $rootScope.$emit(appEvents['error'], {
                        type: appErrors['response.error'],
                        rejection: rejection
                    });
                }
            }

            return {
                'responseError': function(rejection) {
                    responseErrorHandler(rejection);
                    return $q.reject(rejection);
                }
            };
        }]);
    }])
    //
    .service('appHelper', ['$rootScope', 'appEvents', function($rootScope, appEvents) {
        //
        this.checkFormRemoteError = function(error, $scope) {
            // TODO model validation
            // TODO form.$setValidity

            var extraValidation =
                _.get(error, 'validation.extra') ||
                _.get(error, 'validation.model') || {
                    'unknown': {
                        key: 'unknown',
                        rejections: ['error']
                    }
                };

            if (_.isEmpty(extraValidation)) {
                $rootScope.$emit(appEvents['error']);
            } else {
                $scope.extraValidation = extraValidation;
            }
        };
    }]);
//
