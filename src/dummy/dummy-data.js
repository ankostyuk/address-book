/**
 * @author ankostyuk
 */

module.exports = {
    'users': [{
        id: '1',
        name: 'Андрей Костюк',
        email: 'andrew.kostyuk@gmail.com',
        password: '1',
        contacts: [{
            id: '1-1',
            name: 'Иванов Петр Васильевич',
            connections: [{
                type: 'phone',
                value: '+7 111 111 11 11',
                _create: 1
            }, {
                type: 'phone',
                value: '+7 222 222 22 22',
                _create: 2
            }, {
                type: 'email',
                value: 'ipv@example.com',
                _create: 1
            }, {
                type: 'skype',
                value: 'ipv',
                _create: 1
            }]
        }, {
            id: '1-2',
            name: 'Ваня',
            connections: [{
                type: 'phone',
                value: '+7 900 900 90 90',
                _create: 1
            }, {
                type: 'phone',
                value: '+7 999 999 99 99',
                _create: 2
            }, {
                type: 'email',
                value: 'vanya@example.com',
                _create: 1
            }, {
                type: 'skype',
                value: 'vanya',
                _create: 1
            }]
        }, {
            id: '1-3',
            name: 'Петя',
            connections: [{
                type: 'phone',
                value: '+7 900 765 43 21',
                _create: 1
            }, {
                type: 'email',
                value: 'petya@example.com',
                _create: 1
            }, {
                type: 'skype',
                value: 'petya',
                _create: 1
            }]
        }, {
            id: '1-4',
            name: 'Вася',
            connections: [{
                type: 'phone',
                value: '+7 900 123 45 67',
                _create: 1
            }, {
                type: 'email',
                value: 'vasya@example.com',
                _create: 1
            }, {
                type: 'skype',
                value: 'vasya',
                _create: 1
            }]
        }]
    }, {
        id: '2',
        name: 'Саша Костюк',
        email: 'sasha@example.com',
        password: '1',
        contacts: [{
            id: '2-1',
            name: 'Петя',
            connections: [{
                type: 'phone',
                value: '+7 900 000 00 01',
                _create: 1
            }, {
                type: 'email',
                value: 'petya@example.com',
                _create: 1
            }, {
                type: 'skype',
                value: 'petya',
                _create: 1
            }]
        }, {
            id: '2-2',
            name: 'Вася',
            connections: [{
                type: 'phone',
                value: '+7 900 000 00 02',
                _create: 1
            }, {
                type: 'email',
                value: 'vasya@example.com',
                _create: 1
            }, {
                type: 'skype',
                value: 'vasya',
                _create: 1
            }]
        }]
    }, {
        id: '3',
        name: 'Егор Костюк',
        email: 'egor@example.com',
        password: '1'
    }]
};
