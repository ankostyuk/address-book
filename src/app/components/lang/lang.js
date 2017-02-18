/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('./lang-switch')
];

module.exports = angular.module('app.lang', _.map(ngModules, 'name'));
