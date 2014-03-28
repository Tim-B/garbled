'use strict';

angular.module('garbledApp')
    .service('Inboxservice', ["$firebase", "$rootScope", function Inboxservice($firebase, $rootScope) {
        var service = this;
        service.fb = null;
        this.init = function () {
            service.fb = $firebase($rootScope.fb.child('inbox'));
            service.fb.$on("change", function () {
                service.processIncoming();
            });
        }
        this.processIncoming = function () {
            var keys = service.fb.$getIndex();
            keys.forEach(function (key, i) {
                var message = service.fb[i];
                console.log(message);
            });
        };
    }]);
