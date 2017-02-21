/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

module.exports = angular.module('app.security.service', [])
    //
    .service('securityService', ['$rootScope', '$timeout', 'securityResource', 'appEvents', function($rootScope, $timeout, securityResource, appEvents) {
        var user = null;

        function isUserChanged(u) {
            return !_.isEqual(user, u);
        }

        function applyUser(u, error, callback, force) {
            u = u || null;
            var changed = force || isUserChanged(u);
            user = error ? null : u;
            callback(user, error);
            changed && emitUser();
        }

        function emitUser() {
            $rootScope.$emit(appEvents['app.user'], user);
        }

        function bootstrapUser() {
            $timeout(function() {
                securityResource.userInfoRequest({
                    callback: function(u, error) {
                        applyUser(u, error, _.noop, true);
                    }
                });
            });
        }

        //
        this.signup = function(signupData, callback) {
            securityResource.signupRequest({
                signupData: signupData,
                callback: function(u, error) {
                    applyUser(u, error, callback);
                }
            });
        }

        //
        this.login = function(loginData, callback) {
            securityResource.loginRequest({
                loginData: loginData,
                callback: function(u, error) {
                    applyUser(u, error, callback);
                }
            });
        }

        this.logout = function() {
            securityResource.logoutRequest({
                callback: function(u, error) {
                    applyUser(u, error, _.noop);
                }
            });
        }

        //
        this.isAuthenticated = function() {
            return !!user;
        }

        //
        this.getUser = function() {
            return user;
        }

        bootstrapUser();
    }]);
//
