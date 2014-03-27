'use strict';

angular.module('garbledApp')
    .service('Chatservice', ["$firebase", "$rootScope", function Chatservice($firebase, $rootScope) {
        this.fb = null;
        return {
            init: function() {
                this.fb = $firebase($rootScope.fb.child('chat'));
            },
            fb: this.fb
        };
    }]);
