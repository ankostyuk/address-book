/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    i18n    = require('i18n'),
    angular = require('angular');

var templates = {
    'intro': require('./views/intro.html'),
    'contacts': require('./views/contacts.html'),
    'contact-form': require('./views/contact-form.html'),
    'address-book': require('./views/address-book.html')
};

//
var connectionsMeta = {
    'phone': {
        order: 100
    },
    'email': {
        order: 200
    },
    'skype': {
        order: 300
    }
};

var connectionsMetaOrdered = _.orderBy(_.map(connectionsMeta, function(connectionType, name) {
    connectionType.name = name;
    return connectionType;
}), ['order'], ['asc']);

//
module.exports = angular.module('app.address-book.ui', [])
    //
    .run(['utils', function(utils) {
        utils.translateTemplates(templates);
    }])
    //
    .directive('appAddressBook', ['$rootScope', 'utils', 'securityService', 'Contact', function($rootScope, utils, securityService, Contact) {
        return {
            restrict: 'A',
            template: templates['address-book'],
            scope: {},
            controller: ['$scope', function($scope) {
                _.extend($scope, {
                    isShown: false,
                    contacts: null,
                    search: {},
                    currentContact: null,
                    editedContact: null,
                    connectionsMetaOrdered: connectionsMetaOrdered,
                    editState: false,

                    loadContacts: function(selectedContact) {
                        $scope.contacts = Contact.query(function() {
                            $scope.clearCurrentContact();
                            selectedContact && $scope.contacts && $scope.selectContact(selectedContact);
                        });

                        $scope.isShown = true;
                    },

                    selectContact: function(contact) {
                        $scope.currentContact = contact;
                        $scope.editedContact = angular.copy(contact);
                        $scope.editState = false;

                        utils.scrollTop();
                    },

                    clearCurrentContact: function() {
                        $scope.currentContact = null;
                        $scope.editedContact = null;
                        $scope.editState = false;
                    },

                    isSearch: function() {
                        return !!$scope.search.name;
                    },

                    isEmpty: function() {
                        if ($scope.editedContact) {
                            return false;
                        }
                        return _.isEmpty($scope.contacts);
                    }
                }, i18n.translateFuncs);

                function bootstrap() {
                    $scope.loadContacts();
                }

                function reset() {
                    $scope.isShown = false;
                    $scope.contacts = null;
                    $scope.search = {};
                    $scope.currentContact = null;
                    $scope.editedContact = null;
                    $scope.editState = false;
                }

                securityService.onUserSignin(function() {
                    bootstrap();
                });

                securityService.onLoginRequired(function() {
                    reset();
                });
            }]
        }
    }])
    //
    .directive('appAddressBookIntro', [function() {
        return {
            restrict: 'A',
            template: templates['intro'],
            scope: false
        }
    }])
    //
    .directive('appAddressBookContacts', [function() {
        return {
            restrict: 'A',
            template: templates['contacts'],
            scope: false
        }
    }])
    //
    .directive('appAddressBookContactForm', ['$timeout', 'Contact', function($timeout, Contact) {
        return {
            restrict: 'A',
            template: templates['contact-form'],
            scope: false,
            controller: ['$scope', '$element', function($scope, $element) {
                _.extend($scope, {
                    addConnection: function(contact, connectionType) {
                        contact.connections = contact.connections || [];
                        contact.connections.push({
                            type: connectionType
                        });

                        $scope.editState = true;

                        $timeout(function() {
                            $element.find(
                                '.connections .connection-index-' +
                                (_.size(contact.connections) - 1) +
                                ' .connection-value .inline-edited'
                            ).click();
                        });
                    },

                    deleteConnection: function(contact, connectionIndex) {
                        _.remove(contact.connections, function(c, i) {
                            return connectionIndex === i;
                        });
                    },

                    createContact: function() {
                        $scope.clearCurrentContact();

                        $scope.editedContact = {};
                        $scope.editState = true;

                        $timeout(function() {
                            $element.find('.contact-name-header .inline-edited').click();
                        });
                    },

                    saveContact: function() {
                        if (!$scope.editedContact.id) {
                            var newContact = new Contact($scope.editedContact);
                            newContact.$create(function() {
                                $scope.loadContacts(newContact);
                            });

                        } else if (isContactChanged()) {
                            angular.extend($scope.currentContact, $scope.editedContact);
                            $scope.currentContact.$save(function() {
                                $scope.loadContacts($scope.currentContact);
                            });
                        }

                        $scope.editState = false;
                    },

                    rollbackContactChanges: function() {
                        if (isContactChanged()) {
                            $scope.editedContact = angular.copy($scope.currentContact);
                        }

                        $scope.editState = false;
                    },

                    deleteContact: function() {
                        $timeout(function() {
                            $scope.currentContact.$delete(function() {
                                $scope.loadContacts();
                            });

                            $scope.editState = false;
                        });
                    }
                });

                function isContactChanged() {
                    return !angular.equals($scope.currentContact, $scope.editedContact);
                }
            }]
        }
    }])
    //
    .directive('appAddressBookContactInlineEdit', [function() {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element) {
                var inlineEditedElement = element.find('.inline-edited'),
                    inlineEditElement   = element.find('.inline-edit-element');

                inlineEditedElement.click(function() {
                    if (!scope.editState) {
                        return;
                    }
                    element.addClass('inline-edit-open');
                    inlineEditElement.focus();
                });

                inlineEditElement
                    .blur(function() {
                        element.removeClass('inline-edit-open');
                    })
                    .keypress(function(event) {
                        var key = (event.keyCode ? event.keyCode : event.which);
                        if (key == '13') {
                            element.removeClass('inline-edit-open');
                        }
                    });
                //
            }
        }
    }]);
//
