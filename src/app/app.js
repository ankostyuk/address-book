'use strict';

/**
 * @author ankostyuk
 */

var info = require('info/info');

var $       = require('jquery'),
    _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('i18n-app/i18n'),
    require('app/components/lang/lang'),
    require('app/components/login/login'),
    require('app/components/message/message')
];

require('bootstrap/dist/css/bootstrap.css');
require('commons-angular/directives/directives');
require('./styles/app.less');

angular.module('app', _.map(ngModules, 'name'))
    //
    .constant('appConfig', {
        name: _tr('app.name'),
        resource: {
        },
        events: {
        }
    })
    //
    .config(['$logProvider', '$compileProvider', function($logProvider, $compileProvider) {
        $logProvider.debugEnabled(!CONFIG.PRODUCTION);
        $compileProvider.debugInfoEnabled(!CONFIG.PRODUCTION);
        $compileProvider.commentDirectivesEnabled(!CONFIG.PRODUCTION);
        $compileProvider.cssClassDirectivesEnabled(!CONFIG.PRODUCTION);
    }])
    //
    .run(['$log', '$rootScope', '$timeout', 'appConfig', 'i18nService', function($log, $rootScope, $timeout, appConfig, i18nService) {
        _.extend($rootScope, {
            appConfig: appConfig,
            app: {
                info: info,
                lang: i18nService.getLang(),
                ready: false
            },
            isAppReady: function() {
                return $rootScope.app.ready;
            }
        });

        $timeout(function() {
            $rootScope.app.ready = true;
        }, 500);
    }]);
//

$(function() {
    angular.bootstrap(document, ['app'], {
        strictDi: CONFIG.PRODUCTION
    });
});
