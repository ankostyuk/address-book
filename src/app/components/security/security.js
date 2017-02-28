'use strict';

/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('./ui/security-ui'),
    require('./user'),
    require('./security-service')
];

module.exports = angular.module('app.security', _.map(ngModules, 'name'));
