'use strict';

angular.module('garbledApp')
    .service('Contactservice', ["$firebase", "$rootScope", "$q", function Contactservice($firebase, $rootScope, $q) {
        this.fb = null;
        this.deffered = $q.defer();
        var service = this;
        this.init = function () {
            this.fb = $firebase($rootScope.fb.child('contact'));
            this.fb.$on("loaded", function () {
                service.deffered.resolve();
            });
        };
        this.findByFingerPrint = function (fingerprint) {
            var fb = this.fb;
            var keys = fb.$getIndex();
            var returnVal = null;
            keys.forEach(function (key, i) {
                var contact = fb.$child(key);
                if (contact.fingerPrint == fingerprint) {
                    returnVal = contact;
                }
            });
            return returnVal;
        };
        this.promise = this.deffered.promise;
    }]);
