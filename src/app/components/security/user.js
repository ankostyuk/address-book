/**
 * @author ankostyuk
 */

var angular = require('angular');

require('angular-resource');

//
module.exports = angular.module('app.security.user', ['ngResource'])
    //
    .factory('User', ['$resource', 'appConfig', function($resource, appConfig) {
        //
        var User = $resource(appConfig.resource['user.url'], {}, {
            'info': {
                method: 'GET'
            },
            'login': {
                method: 'POST',
                url: appConfig.resource['login.url']
            },
            'signup': {
                method: 'POST',
                url: appConfig.resource['signup.url']
            },
            'logout': {
                method: 'POST',
                url: appConfig.resource['logout.url']
            }
        });

        return User;
    }]);
//
