'use strict';

/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('./resource-mocks')
];

module.exports = angular.module('dummy', _.map(ngModules, 'name'));
