/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('./error-message')
];

module.exports = angular.module('app.message', _.map(ngModules, 'name'));
