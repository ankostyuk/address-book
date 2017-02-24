/**
 * @author ankostyuk
 */

var _               = require('lodash'),
    uuid            = require('uuid'),
    clientStorage   = require('client-storage/client-storage'),
    angular         = require('angular');

require('angular-mocks');

var dummyDAO = require('./dummy-dao');

//
function buildUserToken() {
    return uuid.v4();
}

function storeUserToken(user, token) {
    sroreDummyToken({
        userId: user.id,
        token: token
    });
}

function getDummyToken() {
    return clientStorage.getItem('dummyToken') || {};
}

function sroreDummyToken(token) {
    return clientStorage.setItem('dummyToken', token);
}

function getAuthUser(headers) {
    var token = (_.get(headers, 'Authorization') || '').replace('Bearer ', '');

    if (!token) {
        return null;
    }

    var dummyToken  = getDummyToken(),
        userId      = (token === dummyToken.token ? dummyToken.userId : null);

    return userId ? dummyDAO.getUserById({
        id: userId
    }) : null;
}

function authUser(user) {
    user = _.cloneDeep(user);

    var token = buildUserToken();

    storeUserToken(user, token);
    user.token = token;

    return user;
}

function resetUserAuth() {
    sroreDummyToken(null);
}

function getUserInfo(user) {
    return _.omit(user, ['contacts', 'password']);
}

//
module.exports = angular.module('dummy.resource-mocks', ['ngMockE2E'])
    //
    .run(['$log', '$httpBackend', function($log, $httpBackend) {
        // get user
        $httpBackend.whenGET('/user').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);
            var user = getAuthUser(headers);
            return user ? [200, getUserInfo(user)] : [401];
        });

        // user login
        $httpBackend.whenPOST('/login').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var loginData   = angular.fromJson(data),
                user        = dummyDAO.getUser(loginData);

            if (!user) {
                return [400, {
                    validation: {
                        extra: [{
                            key: 'login',
                            rejections: ['incorrect']
                        }]
                    }
                }];
            }

            user = authUser(user);

            return [200, getUserInfo(user)];
        });

        // user signup
        $httpBackend.whenPOST('/signup').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var signupData  = angular.fromJson(data),
                checkedUser = dummyDAO.getUserByEmail(signupData);

            if (checkedUser) {
                return [400, {
                    validation: {
                        extra: [{
                            key: 'signup',
                            rejections: ['user.exist']
                        }]
                    }
                }];
            }

            var user = dummyDAO.createUser(signupData);

            user = authUser(user);

            return [200, getUserInfo(user)];
        });

        // user logout
        $httpBackend.whenPOST('/logout').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);
            resetUserAuth();
            return [204];
        });

        // contacts
        $httpBackend.whenPOST('/api/contacts').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var user = getAuthUser(headers);

            if (!user) {
                return [401];
            }

            var contactData = angular.fromJson(data),
                contact     = dummyDAO.createUserContact(user, contactData);

            return contact ? [200, contact] : [500];
        });

        $httpBackend.whenPUT(/\/api\/contacts\/(.+)/, undefined, undefined, ['id']).respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var user = getAuthUser(headers);

            if (!user) {
                return [401];
            }

            var contactData = angular.fromJson(data),
                contact     = dummyDAO.saveUserContact(user, params.id, contactData);

            return contact ? [200, contact] : [500];
        });

        $httpBackend.whenDELETE(/\/api\/contacts\/(.+)/, undefined, ['id']).respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);

            var user = getAuthUser(headers);

            if (!user) {
                return [401];
            }

            var contactId = dummyDAO.deleteUserContact(user, params.id);

            return contactId ? [204] : [500];
        });

        $httpBackend.whenGET('/api/contacts').respond(function(method, url, data, headers, params){
            $log.debug(method, url, data, headers, params);
            var user = getAuthUser(headers);
            return user ? [200, dummyDAO.getUserContacts(user)] : [401];
        });
    }]);
//
