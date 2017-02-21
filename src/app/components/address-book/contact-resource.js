/**
 * @author ankostyuk
 */

var angular = require('angular');

require('angular-resource');

//
module.exports = angular.module('app.address-book.contact-resource', ['ngResource'])
    //
    .factory('Contact', ['$resource', function($resource) {
        //
        var Contact = $resource('/contacts/:contactId', {
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
