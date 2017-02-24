/**
 * @author ankostyuk
 */

var angular = require('angular');

require('angular-resource');

//
module.exports = angular.module('app.address-book.contact', ['ngResource'])
    //
    .factory('Contact', ['$resource', 'appConfig', function($resource, appConfig) {
        var baseUrl = appConfig.resource['contacts.url'];

        //
        var Contact = $resource(baseUrl + '/:contactId', {
            contactId: '@id'
        }, {
            'create': {
                method: 'POST'
            },
            'save': {
                method: 'PUT'
            }
        });

        return Contact;
    }]);
//
