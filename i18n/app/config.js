'use strict';

/**
 * @author ankostyuk
 */

var langs = require('./langs');

module.exports = {
    langs: langs.translatableLangs,
    defaultLang: langs.translatableLangs[0],
    'i18n-component': {
        // Должны отличаться от общих настроек шаблонизатора,
        // т.к. смысл шаблонизации i18n:
        //   только перевести текст шаблона,
        //   а далее использовать переведённый шаблон с шаблонизатором по умолчанию
        templateSettings: {
            evaluate:       '',
            interpolate:    /\$\{([\s\S]+?)\}/g,
            escape:         ''
        },
        escape: false
    },
    bundles: [
        require('../bundles/ui/bundle.json'),
        require('../bundles/ui_keys/bundle.json')
    ]
};
