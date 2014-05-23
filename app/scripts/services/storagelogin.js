'use strict';

angular.module('garbledApp')
    .service('Storagelogin', ["$rootScope", "$firebase", "Chatservice", "Identityservice", "Contactservice", "Inboxservice", "Keyservice", "$q",
        function Storagelogin($rootScope, $firebase, Chatservice, Identityservice, Contactservice, Inboxservice, Keyservice, $q) {
            this.defer = $q.defer();
            var service = this;
            $rootScope.fb = new Firebase("https://sweltering-fire-9426.firebaseio.com/");
            $rootScope.fbRoot = $rootScope.fb;
            this.auth = new FirebaseSimpleLogin($rootScope.fb, function (error, user) {
                if (error) {
                    $rootScope.$emit("login-error", error);
                } else if (user) {
                    $rootScope.fb = $rootScope.fbRoot.child(user.uid);
                    Identityservice.init();
                    Keyservice.init();
                    Contactservice.init();
                    Inboxservice.init();
                    $rootScope.$emit("logged-in", user);
                    service.defer.resolve();

                } else {
                    $rootScope.$emit("logged-out");
                }
            });
            this.promise = this.defer.promise;
        }]);
