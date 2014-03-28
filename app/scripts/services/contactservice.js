'use strict';

angular.module('garbledApp')
    .service('Contactservice', function Contactservice($firebase, $rootScope) {
        this.fb = null;
        return {
            init: function () {
                this.fb = $firebase($rootScope.fb.child('contact'));
            },
            fb: this.fb
        };
    });
