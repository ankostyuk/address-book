/**
 * @author ankostyuk
 */

var _               = require('lodash'),
    uuid            = require('uuid'),
    clientStorage   = require('client-storage/client-storage');

var dummyData = clientStorage.getItem('dummyData') || require('./dummy-data');

console.log('dummyData:', dummyData);

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

//
function storeData() {
    clientStorage.setItem('dummyData', dummyData);
}

function isObjectInvalid(o) {
    return !_.isObject(o) || _.isEmpty(o);
}

function getMatches(data, paths) {
    var matches = _.pick(data, paths);
    return _.isEmpty(matches) ? null : matches;
}

function findByMatches(collections, data, paths) {
    var matches = getMatches(data, paths);
    return matches ? _.find(collections, matches) : null;
}

function transformUser(user) {
    // TODO
    return isObjectInvalid(user) ? null : user;
}

function sortUserContacts(user) {
    if (isObjectInvalid(user)) {
        return;
    }

    user.contacts = _.orderBy(user.contacts, ['name'], ['asc']);

    _.each(user.contacts, function(contact) {
        sortContactConnections(contact);
    });
}

function sortContactConnections(contact) {
    if (isObjectInvalid(contact)) {
        return;
    }

    contact.connections = _.orderBy(contact.connections, [connectionTypeSorter, '_create'], ['asc', 'asc']);
}

function connectionTypeSorter(connection) {
    return _.get(connectionsMeta[connection.type], 'order');
}

function checkContactData(contactData) {
    // TODO validation
    contactData = _.pick(contactData, ['name', 'connections']);

    // connections
    contactData.connections = contactData.connections || [];

    _.each(contactData.connections, function(connection) {
        connection._create = connection._create || _.now();
    });

    return contactData;
}

//
var api = {
    //
    createUser: function(userData) {
        var user = _.extend({}, userData, {
            id: uuid.v4()
        });

        dummyData.users.push(user);

        storeData();

        return transformUser(user);
    },

    getUserById: function(userData) {
        return transformUser(findByMatches(dummyData.users, userData, ['id']));
    },

    getUserByEmail: function(userData) {
        return transformUser(findByMatches(dummyData.users, userData, ['email']));
    },

    getUser: function(userData) {
        return transformUser(findByMatches(dummyData.users, userData, ['email', 'password']));
    },

    getUserContactById: function(user, contactId) {
        return findByMatches(user.contacts, {
            id: contactId
        }, ['id']);
    },

    createUserContact: function(userData, contactData) {
        var user = api.getUserById(userData);

        if (!user) {
            return null;
        }

        var contact = _.extend({}, checkContactData(contactData), {
            id: uuid.v4()
        });

        user.contacts = user.contacts || [];
        user.contacts.push(contact);

        storeData();

        return contact;
    },

    saveUserContact: function(userData, contactId, contactData) {
        var user = api.getUserById(userData);

        if (!user) {
            return null;
        }

        var contact = api.getUserContactById(user, contactId);

        if (!contact) {
            return null;
        }

        _.extend(contact, _.omit(checkContactData(contactData), ['id']));

        storeData();

        return contact;
    },

    deleteUserContact: function(userData, contactId) {
        var user = api.getUserById(userData);

        if (!user) {
            return null;
        }

        var contact = api.getUserContactById(user, contactId);

        if (!contact) {
            return null;
        }

        var deleted = false;

        _.remove(user.contacts, function(contact) {
            deleted = deleted || contact.id === contactId;
            return contact.id === contactId;
        });

        if (!deleted) {
            return null;
        }

        storeData();

        return contactId;
    },

    getUserContacts: function(userData) {
        var user = api.getUserById(userData);
        sortUserContacts(user);
        return _.get(user, 'contacts');
    }
};

module.exports = api;
