'use strict';

/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('./ui/message-ui')
];

module.exports = angular.module('app.message', _.map(ngModules, 'name'));
