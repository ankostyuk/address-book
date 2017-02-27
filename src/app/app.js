'use strict';

/**
 * @author ankostyuk
 */

var appInfo = require('info/info');

var $       = require('jquery'),
    _       = require('lodash'),
    angular = require('angular');

require('bootstrap/dist/js/bootstrap');

var ngModules = [
    require('i18n-app/i18n'),

    require('commons-angular/directives/directives'),

    require('app/components/helper/helper'),
    require('app/components/address-book/address-book'),
    require('app/components/lang/lang'),
    require('app/components/message/message'),
    require('app/components/security/security'),

    require('utils/utils')
];

require('bootstrap/dist/css/bootstrap.css');
require('./styles/app.less');

injectDummy();

angular.module('app', _.map(ngModules, 'name'))
    //
    .constant('appConfig', {
        name: _tr('app.name'),
        resource: {
            'user.url':     '/api/user',
            'signup.url':   '/api/user/signup',
            'login.url':    '/api/user/login',
            'logout.url':   '/api/user/logout',
            'contacts.url': '/api/contacts'
        },
        readyDelay: 500
    })
    .constant('appEvents', {
        'ready':                    'app.ready',
        'security.unauthorized':    'app.security.unauthorized',
        'security.login.required':  'app.security.login.required',
        'security.user.signin':     'app.security.user.signin',
        'error':                    'app.error'
    })
    //
    .constant('appErrors', {
        'response.error': 'app.response.error'
    })
    //
    .config(['$qProvider', '$logProvider', '$compileProvider', function($qProvider, $logProvider, $compileProvider) {
        $qProvider.errorOnUnhandledRejections(!CONFIG.PRODUCTION);

        $logProvider.debugEnabled(!CONFIG.PRODUCTION);

        $compileProvider.debugInfoEnabled(!CONFIG.PRODUCTION);
        $compileProvider.commentDirectivesEnabled(!CONFIG.PRODUCTION);
        $compileProvider.cssClassDirectivesEnabled(!CONFIG.PRODUCTION);
    }])
    //
    .run(['$log', '$rootScope', '$timeout', 'appConfig', 'appEvents', 'i18nService', function($log, $rootScope, $timeout, appConfig, appEvents, i18nService) {
        _.extend($rootScope, {
            appConfig: appConfig,
            app: {
                info: appInfo,
                lang: i18nService.getLang(),
                ready: false
            },
            isAppReady: function() {
                return $rootScope.app.ready;
            }
        });

        $timeout(function() {
            $rootScope.app.ready = true;
            $rootScope.$emit(appEvents['ready']);
        }, appConfig.readyDelay);
    }]);
//

$(function() {
    angular.bootstrap(document, ['app'], {
        strictDi: true
    });
});

// TODO remove if no prototype
function injectDummy() {
    if (!appInfo.isPrototype) {
        return;
    }

    ngModules.push(require('dummy/dummy'));
}

// Analytics
require('./analytics');
