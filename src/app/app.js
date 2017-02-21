'use strict';

/**
 * @author ankostyuk
 */

var appInfo = require('info/info');

var $  = require('jquery');
injectJQuery(window);

var _       = require('lodash'),
    angular = require('angular');

require('bootstrap/dist/js/bootstrap');

var ngModules = [
    require('i18n-app/i18n'),

    require('commons-angular/directives/directives'),

    require('app/components/address-book/address-book'),
    require('app/components/lang/lang'),
    require('app/components/message/message'),
    require('app/components/security/security'),
    require('app/components/user/user'),

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
            'user.info.url': '/user-info',
            'signup.url': '/signup',
            'login.url': '/login',
            'logout.url': '/logout',
            'contacts.url': '/api/contacts'
        },
        readyDelay: 500
    })
    .constant('appEvents', {
        'app.user': 'app.user',
        'app.ready': 'app.ready',
        'app.error': 'app.error'
    })
    //
    .config(['$logProvider', '$compileProvider', function($logProvider, $compileProvider) {
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
            $rootScope.$emit(appEvents['app.ready']);
        }, appConfig.readyDelay);
    }]);
//

$(function() {
    angular.bootstrap(document, ['app'], {
        strictDi: true
    });
});

function injectJQuery(root) {
    root.$ = root.jQuery = $;
}

// TODO remove if no prototype
function injectDummy() {
    if (!appInfo.isPrototype) {
        return;
    }

    ngModules.push(require('dummy/dummy'));
}
