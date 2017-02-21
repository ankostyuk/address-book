/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    i18n    = require('i18n'),
    angular = require('angular');

var templates = {
    'login-form':               require('./views/login-form.html'),
    'signup-form':              require('./views/signup-form.html'),
    'remote-validation-info':   require('./views/remote-validation-info.html'),
    'security-dialog':          require('./views/security-dialog.html')
}

//
function checkFormError(error, $scope, $rootScope, appEvents) {
    if (error.validation) {
        // $scope.form.$setValidity('remote.validation', false);
        $scope.remoteValidation = error.validation;
    } else {
        $rootScope.$emit(appEvents['app.error']);
    }
}

//
module.exports = angular.module('app.security.ui', [])
    //
    .run(['utils', function(utils) {
        utils.translateTemplates(templates);
    }])
    //
    .directive('appSecurityDialog', ['$rootScope', 'securityService', 'appEvents', function($rootScope, securityService, appEvents) {
        return {
            restrict: 'A',
            template: templates['security-dialog'],
            scope: {},
            controller: ['$scope', function($scope) {
                var currentForm = 'login';

                _.extend($scope, {
                    isShown: false,
                    hideDialog: function() {
                        $scope.isShown = false;
                    },
                    isFormShown: function(form) {
                        return form === currentForm;
                    },
                    showForm: function(form) {
                        currentForm = form;
                    }
                }, i18n.translateFuncs);

                $rootScope.$on(appEvents['app.user'], function(e, user) {
                    currentForm = user ? currentForm : 'login';
                    $scope.isShown = !user;
                });
            }]
        }
    }])
    //
    .directive('appSignupForm', ['$rootScope', 'appEvents', 'securityService', function($rootScope, appEvents, securityService) {
        return {
            restrict: 'A',
            template: templates['signup-form'],
            scope: true,
            controller: ['$scope', function($scope) {
                _.extend($scope, {
                    signupData: {},
                    pending: false,
                    remoteValidation: null,
                    submit: submit
                });

                function submit() {
                    $scope.pending = true;
                    securityService.signup($scope.signupData, function(user, error) {
                        error ? checkFormError(error, $scope, $rootScope, appEvents) : afterSignup();
                        $scope.pending = false;
                    });
                }

                function afterSignup() {
                    $scope.hideDialog();
                }

                function reset() {
                    $scope.signupData = {};
                    $scope.remoteValidation = null;
                }

                $rootScope.$on(appEvents['app.user'], function() {
                    reset();
                });
            }]
        }
    }])
    //
    .directive('appLoginForm', ['$rootScope', 'appEvents', 'securityService', function($rootScope, appEvents, securityService) {
        return {
            restrict: 'A',
            template: templates['login-form'],
            scope: true,
            controller: ['$scope', function($scope) {
                _.extend($scope, {
                    loginData: {},
                    pending: false,
                    remoteValidation: null,
                    submit: submit
                });

                function submit() {
                    $scope.pending = true;
                    securityService.login($scope.loginData, function(user, error) {
                        error ? checkFormError(error, $scope, $rootScope, appEvents) : afterLogin();
                        $scope.pending = false;
                    });
                }

                function afterLogin() {
                    $scope.hideDialog();
                }

                function reset() {
                    $scope.loginData = {};
                    $scope.remoteValidation = null;
                }

                $rootScope.$on(appEvents['app.user'], function() {
                    reset();
                });
            }]
        }
    }])
    //
    .directive('appRemoteValidationInfo', [function() {
        return {
            restrict: 'A',
            template: templates['remote-validation-info'],
            scope: false
        }
    }]);
//
