/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

module.exports = angular.module('app.security.resource', [])
    //
    .service('securityResource', ['$http', 'appConfig', function($http, appConfig) {
        //
        function successProcess(response, options) {
            options.callback(response.data, null);
        }

        function errorProcess(response, options) {
            if (_.isEmpty(response) || !_.isObject) {
                options.callback(null, {});
            }

            options.callback(null, response.data || {});
        }

        //
        this.userInfoRequest = function(options) {
            $http({
                method: 'GET',
                url: appConfig.resource['user.info.url'],
                data: options.userData
            }).then(
                function(response) {
                    successProcess(response, options);
                },
                function(response) {
                    errorProcess(response, options);
                }
            );
        }

        //
        this.signupRequest = function(options) {
            $http({
                method: 'POST',
                url: appConfig.resource['signup.url'],
                data: options.signupData
            }).then(
                function(response) {
                    successProcess(response, options);
                },
                function(response) {
                    errorProcess(response, options);
                }
            );
        }

        //
        this.loginRequest = function(options) {
            $http({
                method: 'POST',
                url: appConfig.resource['login.url'],
                data: options.loginData
            }).then(
                function(response) {
                    successProcess(response, options);
                },
                function(response) {
                    errorProcess(response, options);
                }
            );
        }

        //
        this.logoutRequest = function(options) {
            $http({
                method: 'POST',
                url: appConfig.resource['logout.url']
            }).then(
                function(response) {
                    successProcess(response, options);
                },
                function(response) {
                    errorProcess(response, options);
                }
            );
        }
    }]);
//
