'use strict';

angular.module('garbledApp')
    .service('Storagelogin', ["$rootScope","$firebase", "config", function Storagelogin($rootScope, $firebase, config) {
        this.auth = new FirebaseSimpleLogin(config.fb_ref, function (error, user) {
            if (error) {
                $rootScope.$emit("login-error", error);
            } else if (user) {
                $rootScope.$emit("logged-in", user);
            } else {
                $rootScope.$emit("logged-out");
            }
        });
    }]);
