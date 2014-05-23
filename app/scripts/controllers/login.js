'use strict';

angular.module('garbledApp')
    .controller('LoginCtrl', ["$scope", "$location", "config", "$rootScope", "Storagelogin",
        function ($scope, $location, config, $rootScope, Storagelogin) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.login = function () {
                topbar.show();

                var md = forge.md.sha256.create();
                md.update($scope.encryptPass);
                var passwordHash = md.digest();
                var hashBytes = passwordHash.getBytes();

                $rootScope.userKey = hashBytes;
                console.log("User key: " + $rootScope.userKey);

                Storagelogin.auth.login('password', {
                    email: $scope.storageUser,
                    password: $scope.storagePass,
                    rememberMe: true
                });

                $rootScope.$on("logged-in", function (user) {
                    $location.path("/");
                    $rootScope.notify.log('You have been logged in.');
                });
            }
        }]);
