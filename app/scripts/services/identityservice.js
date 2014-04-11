'use strict';

angular.module('garbledApp')
    .service('Identityservice', ["$firebase", "$rootScope", "$q", function Identityservice($firebase, $rootScope, $q) {
        this.fb = null;
        this.deffered = $q.defer();
        var service = this;
        this.publicKey = null;
        this.fingerPrint = null;

        this.init = function () {
            service.fb = $firebase($rootScope.fb.child('identity'));
            service.fb.$on("loaded", function () {
                service.publicKey = service.fb.publicKey;
                var md = forge.md.sha256.create();
                md.update(service.publicKey);
                service.fingerPrint = md.digest().toHex();
                service.deffered.resolve();
            });
        };
        this.getFingerPrint = function () {
            return service.fingerPrint;
        };
        this.getPublicKey = function () {
            return service.publicKey;
        };
        this.promise = this.deffered.promise
    }]);
