/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

//
module.exports = angular.module('app.helper', [])
    //
    .constant('appHandledResponseErrorStatuses', [500, 404])
    //
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(['$log', '$q', '$rootScope', 'appEvents', 'appErrors', 'appHandledResponseErrorStatuses', function($log, $q, $rootScope, appEvents, appErrors, appHandledResponseErrorStatuses) {

            function responseErrorHandler(rejection) {
                if (_.includes(appHandledResponseErrorStatuses, rejection.status)) {
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
            var extraValidation = _.get(error, 'validation.extra');

            if (_.isEmpty(extraValidation)) {
                $rootScope.$emit(appEvents['error']);
            } else {
                // TODO form.$setValidity
                $scope.extraValidation = extraValidation;
            }
        };
    }]);
//
