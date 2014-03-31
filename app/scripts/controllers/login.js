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
