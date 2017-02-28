'use strict';

/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('./ui/lang-ui')
];

module.exports = angular.module('app.lang', _.map(ngModules, 'name'));
