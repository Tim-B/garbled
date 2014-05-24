'use strict';

angular.module('garbledApp')
    .controller('LoginCtrl', ["$scope", "$location", "config", "$rootScope", "Storagelogin", "localStorageService",
        function ($scope, $location, config, $rootScope, Storagelogin, localStorageService) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.hideWarning = true;

            $scope.submitDisabled = function() {
                var deviceKey = localStorageService.get('device-key');
                return deviceKey == null;
            }

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
                    topbar.hide();
                    $location.path("/");
                    $rootScope.notify.log('You have been logged in.');
                });
            }
        }]);
