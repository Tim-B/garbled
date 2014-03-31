'use strict';

angular.module('garbledApp')
    .service('Contactservice', function Contactservice($firebase, $rootScope, $q) {
        this.fb = null;
        this.deffered = $q.defer();
        var service = this;
        return {
            init: function () {
                this.fb = $firebase($rootScope.fb.child('contact'));
                this.fb.$on("loaded", function () {
                    service.deffered.resolve();
                });
            },
            findByName: function (name) {
                console.log("Find By Name");
                console.log(this.fb);
                var fb = this.fb;
                var keys = fb.$getIndex();
                var returnVal = null;
                keys.forEach(function (key, i) {
                    var contact = fb.$child(key);
                    if(contact.displayName == name) {
                        returnVal = contact;
                    }
                });
                return returnVal;
            },
            fb: this.fb,
            promise: this.deffered.promise
        };
    });
