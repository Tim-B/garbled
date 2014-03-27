'use strict';

angular.module('garbledApp')
    .service('Storagelogin', ["$rootScope", "$firebase", "Chatservice", "Identityservice", "Contactservice",
        function Storagelogin($rootScope, $firebase, Chatservice, Identityservice, Contactservice) {
            $rootScope.fb = new Firebase("https://sweltering-fire-9426.firebaseio.com/");
            $rootScope.fbRoot = $rootScope.fb;
            this.auth = new FirebaseSimpleLogin($rootScope.fb, function (error, user) {
                if (error) {
                    $rootScope.$emit("login-error", error);
                } else if (user) {
                    $rootScope.fb = $rootScope.fbRoot.child(user.uid);
                    Chatservice.init();
                    Identityservice.init();
                    Contactservice.init();
                    $rootScope.$emit("logged-in", user);
                } else {
                    $rootScope.$emit("logged-out");
                }
            });
        }]);
