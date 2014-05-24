'use strict';

angular.module('garbledApp')
    .controller('RegisterCtrl', ["$scope", "$rootScope", "config", "Chatservice", "Storagelogin", "Identityservice", "Inboxservice", "localStorageService", "$firebase", "Keyservice", "Contactservice", "$location",
        function ($scope, $rootScope, config, Chatservice, Storagelogin, Identityservice, Inboxservice, localStorageService, $firebase, Keyservice, Contactservice, $location) {

            $scope.register = function () {
                topbar.show();
                var fb_instance = new Firebase($scope.storageHost);
                Storagelogin.skipInit = true;
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

                                            Inboxservice.init();

                                            var inbox = Inboxservice.fb.$getRef().toString();

                                            var masterKey = forge.random.getBytesSync(32);
                                            var deviceKey = forge.random.getBytesSync(32);
                                            var iv = forge.random.getBytesSync(16);

                                            var md = forge.md.sha256.create();
                                            md.update($scope.encryptionPass);
                                            var passwordHash = md.digest();
                                            var hashBytes = passwordHash.getBytes();
                                            console.log(forge.util.bytesToHex(hashBytes));

                                            var encryptedMaster = $rootScope.xor(32, masterKey, deviceKey, hashBytes);

                                            console.log("Register Credentials");
                                            console.log(encryptedMaster);
                                            console.log(deviceKey);
                                            console.log(hashBytes);

                                            console.log(forge.util.bytesToHex(encryptedMaster));
                                            console.log(forge.util.bytesToHex(deviceKey));
                                            console.log(forge.util.bytesToHex(hashBytes));
                                            console.log(forge.util.bytesToHex(masterKey));

                                            Keyservice.key = masterKey;
                                            Keyservice.ivVal = iv;

                                            var encPrk = Keyservice.encrypt(forge.pki.privateKeyToPem(keypair.privateKey));

                                            localStorageService.clearAll();
                                            localStorageService.set('device-key', forge.util.bytesToHex(deviceKey));

                                            $firebase($rootScope.fb).$set({
                                                privateKey: encPrk,
                                                masterKey: encryptedMaster,
                                                iv: iv
                                            });


                                            $firebase($rootScope.fb.child('identity')).$set({
                                                displayName: $scope.displayName,
                                                inbox: inbox,
                                                publicKey: pem}
                                            );

                                            $rootScope.userKey = hashBytes;

                                            Identityservice.init();
                                            Keyservice.init();
                                            Contactservice.init();

                                            $rootScope.notify.log('Registration Successful');

                                            $location.path('/').replace();
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
