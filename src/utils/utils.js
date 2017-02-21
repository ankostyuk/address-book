/**
 * @author ankostyuk
 */

var $       = require('jquery'),
    _       = require('lodash'),
    i18n    = require('i18n'),
    angular = require('angular');

//
var htmlBody = $('html, body');

//
module.exports = angular.module('utils', [])
    //
    .service('utils', [function() {
        //
        this.translateTemplates = function(templates) {
            _.each(templates, function(template, name) {
                templates[name] = i18n.translateTemplate(template);
            });
        };

        //
        this.getHtmlBody = function() {
            return htmlBody;
        };

        //
        this.scrollTop = function() {
            htmlBody.stop().animate({
                scrollTop: 0
            }, 200);
        };
    }]);
//
