'use strict';

angular.module('garbledApp')
    .controller('RegisterCtrl', ["$scope", "$rootScope", "config", "Chatservice", "Storagelogin", "Identityservice", "Inboxservice", "localStorageService", "$firebase",
        function ($scope, $rootScope, config, Chatservice, Storagelogin, Identityservice, Inboxservice, localStorageService, $firebase) {

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


                                            var masterKey = forge.random.getBytesSync(32);
                                            var deviceKey = forge.random.getBytesSync(32);

                                            console.log("master");
                                            console.log(masterKey);
                                            console.log(deviceKey);
                                            console.log($scope.encryptionPass);

                                            var md = forge.md.sha256.create();
                                            md.update($scope.encryptionPass);
                                            var passwordHash = md.digest();
                                            var hashBytes = passwordHash.getBytes();
                                            console.log(hashBytes);

                                            var encryptedMaster = $rootScope.xor(32, masterKey, deviceKey, hashBytes);
                                            console.log(encryptedMaster);

                                            var original = $rootScope.xor(32, encryptedMaster, deviceKey, hashBytes);
                                            console.log("original");
                                            console.log(original);

                                            // var
                                            localStorageService.set('device-key', deviceKey);

                                            $firebase($rootScope.fb).$set({privateKey: forge.pki.privateKeyToPem(keypair.privateKey), masterKey: encryptedMaster});
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
