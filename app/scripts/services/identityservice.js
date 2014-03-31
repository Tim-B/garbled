'use strict';

angular.module('garbledApp')
    .service('Identityservice', function Identityservice($firebase, $rootScope, $q) {
        this.fb = null;
        this.deffered = $q.defer();
        var service = this;
        return {
            init: function () {
                this.fb = $firebase($rootScope.fb.child('identity'));
                this.fb.$on("loaded", function() {
                    service.deffered.resolve();
                });
            },
            fb: this.fb,
            promise: this.deffered.promise
        };
    });
