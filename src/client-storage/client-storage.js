'use strict';

/**
 * @author ankostyuk
 */

var _ = require('lodash');

var root        = window,
    appId       = CONFIG['app.id'],
    localConfig;

function checkLocalConfig() {
    var localStorageItem = root.localStorage && root.localStorage.getItem(appId);

    localConfig = null;

    try {
        localConfig = JSON.parse(localStorageItem);
    } catch(e) {
        console.error(e);
    }

    localConfig = localConfig || {};
}

function storeLocalConfig() {
    if (root.localStorage) {
        root.localStorage.setItem(appId, JSON.stringify(localConfig));
    }
}

function setItem(path, value) {
    _.set(localConfig, path, value);
    storeLocalConfig();
}

function getItem(path) {
    return _.get(localConfig, path);
}

checkLocalConfig();

//
module.exports = {
    setItem: setItem,
    getItem: getItem
};
