/**
 * @author ankostyuk
 */

var clientStorage   = require('client-storage/client-storage'),
    angular         = require('angular');

require('angular-mocks');

var dummyDAO = require('./dummy-dao');

function storeUser(user) {
    clientStorage.setItem('userId', user ? user.id : null);
}

function getUser() {
    return {
        id: clientStorage.getItem('userId')
    };
}

module.exports = angular.module('dummy.resource-mocks', ['ngMockE2E'])
    //
    .run(['$log', '$httpBackend', function($log, $httpBackend) {
        // user-info
        $httpBackend.whenGET('/user-info').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var userData    = getUser(),
                user        = dummyDAO.getUserById(userData);

            return user ? [200, user] : [401];
        });

        // signup
        $httpBackend.whenPOST('/signup').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var signupData  = angular.fromJson(data),
                checkedUser = dummyDAO.getUserByEmail(signupData);

            if (checkedUser) {
                return [403, {
                    validation: [{
                        key: 'signup.user.exist'
                    }]
                }];
            }

            var user = dummyDAO.createUser(signupData);

            storeUser(user);

            return [200, user];
        });

        // login
        $httpBackend.whenPOST('/login').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var loginData   = angular.fromJson(data),
                user        = dummyDAO.getUser(loginData);

            if (!user) {
                return [403, {
                    validation: [{
                        key: 'login.invalid'
                    }]
                }];
            }

            storeUser(user);

            return [200, user];
        });

        // logout
        $httpBackend.whenPOST('/logout').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);
            storeUser(null);
            return [200];
        });

        // contacts
        $httpBackend.whenPOST('/contacts').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var userData    = getUser(),
                user        = dummyDAO.getUserById(userData);

            if (!user) {
                return [401];
            }

            var contactData = angular.fromJson(data),
                contact     = dummyDAO.createUserContact(userData, contactData);

            return contact ? [200, contact] : [500];
        });

        $httpBackend.whenPUT(/\/contacts\/(.+)/, undefined, undefined, ['id']).respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var userData    = getUser(),
                user        = dummyDAO.getUserById(userData);

            if (!user) {
                return [401];
            }

            var contactData = angular.fromJson(data),
                contact     = dummyDAO.saveUserContact(userData, params.id, contactData);

            return contact ? [200, contact] : [500];
        });

        $httpBackend.whenDELETE(/\/contacts\/(.+)/, undefined, ['id']).respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var userData    = getUser(),
                user        = dummyDAO.getUserById(userData);

            if (!user) {
                return [401];
            }

            var contactId = dummyDAO.deleteUserContact(userData, params.id);

            return contactId ? [204] : [500];
        });

        $httpBackend.whenGET('/contacts').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var userData    = getUser(),
                user        = dummyDAO.getUserById(userData);

            return user ? [200, dummyDAO.getUserContacts(userData)] : [401];
        });
    }]);
//
