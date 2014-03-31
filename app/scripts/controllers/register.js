'use strict';

angular.module('garbledApp')
    .controller('RegisterCtrl', ["$scope", "$rootScope", "config", "Chatservice", "Storagelogin", "Identityservice", "Inboxservice", "$firebase",
        function ($scope, $rootScope, config, Chatservice, Storagelogin, Identityservice, Inboxservice, $firebase) {

            $scope.register = function () {
                topbar.show();
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
                                    topbar.show();
                                    var rsa = forge.pki.rsa;
                                    rsa.generateKeyPair({bits: 2048, workers: 2}, function (error, keypair) {
                                        topbar.show();
                                        if (!error) {
                                            console.log(keypair);
                                            var pem = forge.pki.publicKeyToPem(keypair.publicKey);
                                            console.log(pem);
                                            var inbox = Inboxservice.fb.$getRef().toString();
                                            $firebase($rootScope.fb).$set({privateKey: forge.pki.privateKeyToPem(keypair.privateKey)});
                                            Identityservice.fb.$set({displayName: $scope.displayName, inbox: inbox, publicKey: pem});
                                            $rootScope.notify.log('Registration Successful');
                                        }
                                        else {
                                            $rootScope.notify.log('There was an error: ' + error.message);
                                        }
                                        topbar.hide();
                                    });
                                }
                            );
                        } else {
                            $rootScope.notify.log('There was an error: ' + error.message);
                            topbar.hide();
                        }
                    }
                );
            }

        }]);
