'use strict';

angular.module('garbledApp')
    .controller('RegisterCtrl', function ($scope, $rootScope, config, Chatservice, Storagelogin, Identityservice, Inboxservice) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.register = function () {
            var fb_instance = new Firebase($scope.storageHost);
            var auth = Storagelogin.auth;
            auth.createUser($scope.storageUser, $scope.storagePass, function (error, user) {
                    if (!error) {
                        Storagelogin.auth.login('password', {
                            email: $scope.storageUser,
                            password: $scope.storagePass,
                            rememberMe: true
                        });
                        $rootScope.$on("logged-in", function (user) {
                            var inbox = Inboxservice.fb.$getRef().toString();
                            Identityservice.fb.$set({displayName: $scope.displayName, inbox: inbox});
                            $rootScope.notify.log('Registration Successful');
                        });
                    }
                    else {
                        $rootScope.notify.log('There was an error: ' + error.message);
                    }
                }
            )
            ;

        }
    })
;
