'use strict';

/**
 * @author ankostyuk
 */

var Uri = require('jsuri');

var location    = document.location,
    locationUri = new Uri(location.href);

module.exports = {
    isPrototype: locationUri.hasQueryParam('prototype')
}
