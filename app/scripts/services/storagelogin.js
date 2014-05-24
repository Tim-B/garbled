'use strict';

angular.module('garbledApp')
    .service('Storagelogin', ["$rootScope", "$firebase", "Chatservice", "Identityservice", "Contactservice", "Inboxservice", "Keyservice", "$q", "$location",
        function Storagelogin($rootScope, $firebase, Chatservice, Identityservice, Contactservice, Inboxservice, Keyservice, $q, $location) {
            this.defer = $q.defer();
            var service = this;
            $rootScope.fb = new Firebase("https://sweltering-fire-9426.firebaseio.com/");
            $rootScope.fbRoot = $rootScope.fb;

            this.skipInit = false;

            this.init = function (user) {
                console.log("Main login");
                Identityservice.init();
                Keyservice.init();
                Contactservice.init();
                Inboxservice.init();

            };

            this.auth = new FirebaseSimpleLogin($rootScope.fb, function (error, user) {
                if (error) {
                    $rootScope.$emit("login-error", error);
                } else if (user) {

                    if($rootScope.userKey == undefined) {
                        $rootScope.notify.log('No user key available, please log in again.');
                        service.auth.logout();
                        $rootScope.user = null;
                        $rootScope.$emit("logged-out");
                        $location.path('/login').replace();
                        return;
                    }

                    $rootScope.fb = $rootScope.fbRoot.child(user.uid);
                    if (!service.skipInit) {
                        service.init(user);
                    }
                    $rootScope.$emit("logged-in", user);
                    service.defer.resolve();
                } else {
                    $rootScope.$emit("logged-out");
                }
            });

            this.promise = this.defer.promise;
        }]);
