/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('./ui/user-ui')
];

module.exports = angular.module('app.user', _.map(ngModules, 'name'));
