/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('./login-form')
];

module.exports = angular.module('app.login', _.map(ngModules, 'name'));
