/**
 * @author ankostyuk
 */

var _               = require('lodash'),
    clientStorage   = require('client-storage/client-storage'),
    angular         = require('angular');

module.exports = angular.module('app.security.service', [])
    //
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$rootScope', 'appConfig', 'appEvents', 'securityTokenService', function($q, $rootScope, appConfig, appEvents, securityTokenService) {

            var authUrls = [
                appConfig.resource['user.url'],
                appConfig.resource['logout.url'],
                appConfig.resource['contacts.url']
            ];

            function isAuthUrl(url) {
                return !!_.find(authUrls, function(authUrl){
                    return _.startsWith(url, authUrl);
                });
            }

            function responseErrorHandler(rejection) {
                if (rejection.status === 401) {
                    $rootScope.$emit(appEvents['security.unauthorized']);
                }
            }

            return {
                'request': function(config) {
                    var token = securityTokenService.getUserToken();

                    if (token && isAuthUrl(config.url)) {
                        _.set(config.headers, 'Authorization', 'Bearer ' + token);
                    }

                    return config;
                },
                'responseError': function(rejection) {
                    responseErrorHandler(rejection);
                    return $q.reject(rejection);
                }
            };
        }]);
    }])
    //
    .service('securityTokenService', [function() {
        var userToken = clientStorage.getItem('userToken') || null;

        //
        this.setUserToken = function(token) {
            userToken = token || null;
            clientStorage.setItem('userToken', userToken);
        };

        //
        this.getUserToken = function() {
            return userToken;
        };
    }])
    //
    .service('securityService', ['$rootScope', '$timeout', 'securityTokenService', 'appEvents', 'User', 'utils', function($rootScope, $timeout, securityTokenService, appEvents, User, utils) {
        var user = null;

        function storeUserToken(u) {
            securityTokenService.setUserToken(_.get(u, 'token'));
            _.unset(u, 'token');
        }

        function applyUser(u) {
            user = u;
            user && $rootScope.$emit(appEvents['security.user.signin']);
        }

        function succesSignin(u, successHandler) {
            // if (!_.get(u, 'token')) {
            //     throw new Error('No token');
            // }
            storeUserToken(u);
            applyUser(u);
            successHandler && successHandler();
        }

        function errorSignin(response, errorHandler) {
            utils.requestErrorHandler(response);
            errorHandler && errorHandler(response.data);
        }

        function signout() {
            storeUserToken(null);
            applyUser(null);
            $rootScope.$emit(appEvents['security.login.required']);
        }

        function bootstrapUser() {
            $timeout(function() {
                User.info(applyUser);
            });
        }

        //
        $rootScope.$on(appEvents['security.unauthorized'], signout);

        //
        this.login = function(loginData, successHandler, errorHandler) {
            User.login(loginData).$promise.then(
                function(u) {
                    succesSignin(u, successHandler);
                },
                function(response) {
                    errorSignin(response, errorHandler);
                }
            );
        }

        //
        this.signup = function(signupData, successHandler, errorHandler) {
            User.signup(signupData).$promise.then(
                function(u) {
                    succesSignin(u, successHandler);
                },
                function(response) {
                    errorSignin(response, errorHandler);
                }
            );
        }

        //
        this.logout = function() {
            User.logout(signout);
        }

        //
        this.onLoginRequired = function(callback) {
            callback && $rootScope.$on(appEvents['security.login.required'], function() {
                callback();
            });
        };

        //
        this.onUserSignin = function(callback) {
            callback && $rootScope.$on(appEvents['security.user.signin'], function() {
                callback();
            });
        };

        //
        this.getUser = function() {
            return user;
        };

        //
        bootstrapUser();
    }]);
//
