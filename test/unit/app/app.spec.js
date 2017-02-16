'use strict';

/**
 * @author ankostyuk
 */

describe('app', function(){
    var $rootScope, appConfig;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        appConfig = $injector.get('appConfig');
    }));

    describe('$rootScope', function() {
        describe('appConfig', function() {
            it('should be not empty', function() {
                expect($rootScope.appConfig).to.be.an('object');
                expect($rootScope.appConfig).not.to.be.empty;
            });
        });
    });

    describe('appConfig', function() {
        it('should be not empty', function() {
            expect(appConfig).to.be.an('object');
            expect(appConfig).not.to.be.empty;
        });
    });
});
