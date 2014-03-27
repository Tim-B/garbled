'use strict';

angular.module('garbledApp')
    .service('Identityservice', function Identityservice($firebase, $rootScope) {
        this.fb = null;
        return {
            init: function () {
                this.fb = $firebase($rootScope.fb.child('identity'));
            },
            fb: this.fb
        };
    });
