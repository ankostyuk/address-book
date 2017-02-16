'use strict';

/**
 * @author ankostyuk
 */

require('bootstrap/dist/css/bootstrap.css');
require('./styles/app.less');

var $       = require('jquery'),
    _       = require('lodash'),
    angular = require('angular');

var ngModules = [
];

angular.module('app', _.map(ngModules, 'name'))
    //
    .constant('appConfig', {
        name: 'Address Book',
        resource: {
        },
        events: {
        }
    })
    //
    .config(['$logProvider', '$compileProvider', function($logProvider, $compileProvider){
        $logProvider.debugEnabled(!PRODUCTION);
        $compileProvider.debugInfoEnabled(!PRODUCTION);
        $compileProvider.commentDirectivesEnabled(!PRODUCTION);
        $compileProvider.cssClassDirectivesEnabled(!PRODUCTION);
    }])
    //
    .run(['$log', '$rootScope', '$timeout', 'appConfig', function($log, $rootScope, $timeout, appConfig){
        _.extend($rootScope, {
            appConfig: appConfig,
            app: {
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
        strictDi: PRODUCTION
    });
});
