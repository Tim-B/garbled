'use strict';

angular.module('garbledApp')
    .service('Inboxservice', ["$firebase", "$rootScope", function Inboxservice($firebase, $rootScope) {
        this.fb = null;
        return {
            init: function() {
                this.fb = $firebase($rootScope.fb.child('inbox'));
            },
            fb: this.fb
        };
    }]);
