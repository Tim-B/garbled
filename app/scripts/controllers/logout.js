'use strict';

angular.module('garbledApp')
    .controller('LogoutCtrl', ["$scope", "$rootScope", "$location", "config", "Storagelogin",
        function ($scope, $rootScope, $location, config, Storagelogin) {

            topbar.show();
            Storagelogin.auth.logout();
            $rootScope.notify.log('You have been logged out.');
            $rootScope.user = null;

        }]);
