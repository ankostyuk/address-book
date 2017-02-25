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
        var User = $resource(null, {}, {
            'info': {
                method: 'GET',
                url: appConfig.resource['user.url']
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
