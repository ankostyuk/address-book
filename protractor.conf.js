'use strict';

//
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:8090',

    framework: 'jasmine',
    // framework: 'mocha',
    // mochaOpts: {
    //     reporter: 'spec',
    //     timeout: 4000
    // },

    specs: ['test/e2e/**/*.spec.js']
};
