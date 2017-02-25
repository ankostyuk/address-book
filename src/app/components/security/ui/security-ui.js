/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    i18n    = require('i18n'),
    angular = require('angular');

var templates = {
    'login-form':               require('./views/login-form.html'),
    'signup-form':              require('./views/signup-form.html'),
    'extra-validation-info':    require('./views/extra-validation-info.html'),
    'user-info':                require('./views/user-info.html'),
    'security-dialog':          require('./views/security-dialog.html')
};

//
module.exports = angular.module('app.security.ui', [])
    //
    .run(['utils', function(utils) {
        utils.translateTemplates(templates);
    }])
    //
    .directive('appSecurityDialog', ['$rootScope', '$timeout', 'securityService', 'utils', function($rootScope, $timeout, securityService, utils) {
        return {
            restrict: 'A',
            template: templates['security-dialog'],
            scope: {},
            controller: ['$scope', '$element', function($scope, $element) {
                _.extend($scope, {
                    isShown: false,
                    currentForm: 'login',
                    hideDialog: function() {
                        $scope.isShown = false;
                    },
                    showLoginForm: function() {
                        $scope.currentForm = 'login';
                        focusFormElement('[app-login-form] input[name=email]');
                    },
                    showSignupForm: function() {
                        $scope.currentForm = 'signup';
                        focusFormElement('[app-signup-form] input[name=name]');
                    }
                }, i18n.translateFuncs);

                securityService.onLoginRequired(function() {
                    $scope.showLoginForm();
                    $scope.isShown = true;
                });

                function focusFormElement(selector) {
                    utils.scrollTop(function() {
                        $element.find(selector).focus();
                    });
                }
            }]
        }
    }])
    //
    .directive('appSignupForm', ['$rootScope', 'appHelper', 'securityService', function($rootScope, appHelper, securityService) {
        return {
            restrict: 'A',
            template: templates['signup-form'],
            scope: true,
            controller: ['$scope', function($scope) {
                _.extend($scope, {
                    signupData: {},
                    pending: false,
                    extraValidation: null,
                    submit: submit
                });

                function submit() {
                    $scope.pending = true;
                    securityService.signup(
                        $scope.signupData,
                        function() {
                            $scope.pending = false;
                            afterSignup();
                        },
                        function(error) {
                            appHelper.checkFormRemoteError(error, $scope);
                            $scope.pending = false;
                        }
                    );
                }

                function afterSignup() {
                    $scope.hideDialog();
                }

                function reset() {
                    $scope.signupData = {};
                    $scope.extraValidation = null;
                }

                securityService.onLoginRequired(function() {
                    reset();
                });

                securityService.onUserSignin(function() {
                    reset();
                });
            }]
        }
    }])
    //
    .directive('appLoginForm', ['$rootScope', 'appHelper', 'securityService', function($rootScope, appHelper, securityService) {
        return {
            restrict: 'A',
            template: templates['login-form'],
            scope: true,
            controller: ['$scope', function($scope) {
                _.extend($scope, {
                    loginData: {},
                    pending: false,
                    extraValidation: null,
                    submit: submit
                });

                function submit() {
                    $scope.pending = true;
                    securityService.login(
                        $scope.loginData,
                        function() {
                            $scope.pending = false;
                            afterLogin();
                        },
                        function(error) {
                            appHelper.checkFormRemoteError(error, $scope);
                            $scope.pending = false;
                        }
                    );
                }

                function afterLogin() {
                    $scope.hideDialog();
                }

                function reset() {
                    $scope.loginData = {};
                    $scope.extraValidation = null;
                }

                securityService.onLoginRequired(function() {
                    reset();
                });

                securityService.onUserSignin(function() {
                    reset();
                });
            }]
        }
    }])
    // TODO move to app.directives
    .directive('appExtraValidationInfo', [function() {
        return {
            restrict: 'A',
            template: templates['extra-validation-info'],
            scope: false
        }
    }])
    //
    .directive('appUserInfo', ['$rootScope', 'securityService', function($rootScope, securityService) {
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

                securityService.onLoginRequired(function() {
                    $scope.user = null;
                });

                securityService.onUserSignin(function() {
                    $scope.user = securityService.getUser();
                });
            }]
        }
    }]);
//
