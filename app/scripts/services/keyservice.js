'use strict';

angular.module('garbledApp')
    .service('Keyservice', ["$firebase", "$rootScope", "localStorageService", "$q", function Keyservice($firebase, $rootScope, localStorageService, $q) {

        this.pk = null;
        this.mk = null;
        this.dk = null;
        this.iv = null;

        this.key = null;
        this.ivVal = null;

        this.deffered = $q.defer();
        var service = this;

        this.privateKey = null;
        this.privateKeyObject = null;

        var decryptKey = function () {

            service.dk = forge.util.hexToBytes(localStorageService.get('device-key'));

            console.log(service.mk);

            console.log("Mk: " + service.mk.$value + ", Dk: " + service.dk + ", Uk: " + $rootScope.userKey);


            console.log("Keys");

            service.key = $rootScope.xor(32, service.mk.$value, service.dk, $rootScope.userKey);

            console.log("Login Credentials");
            console.log(forge.util.bytesToHex(service.mk.$value));
            console.log(forge.util.bytesToHex(service.dk));
            console.log(forge.util.bytesToHex($rootScope.userKey));
            console.log(forge.util.bytesToHex(service.key));

            service.ivVal = service.iv.$value;

            service.pk = $firebase($rootScope.fb.child('privateKey'));
            service.pk.$on("loaded", function () {
                console.log("PK");
                console.log(service.pk);
                var encPk = service.pk.$value;
                service.privateKey = service.decrypt(encPk);

                console.log("Private key: ");
                console.log(service.privateKey);

                service.privateKeyObject = forge.pki.privateKeyFromPem(service.privateKey);
                console.log("Private object: ");
                console.log(service.privateKeyObject);

                service.deffered.resolve();
            });
        }

        this.init = function () {

            service.mk = $firebase($rootScope.fb.child('masterKey'));
            service.iv = $firebase($rootScope.fb.child('iv'));

            var mkLoaded = false;
            var ivLoaded = false;

            service.mk.$on("loaded", function () {
                mkLoaded = true;
                if (ivLoaded && mkLoaded) {
                    decryptKey();
                }
            });

            service.iv.$on("loaded", function () {
                ivLoaded = true;
                if (ivLoaded && mkLoaded) {
                    decryptKey();
                }
            });


        };

        this.promise = this.deffered.promise;

        this.encrypt = function (value, iv, key) {

            iv = iv || service.ivVal;
            key = key || service.key;

            var cipher = forge.aes.createEncryptionCipher(key, 'CBC');
            cipher.start(iv);
            cipher.update(forge.util.createBuffer(value));
            cipher.finish();
            return cipher.output.toHex();
        }

        this.decrypt = function (value, iv, key) {
            iv = iv || service.iv.$value;
            key = key || service.key;
            var bytes = forge.util.hexToBytes(value);
            var buffer = forge.util.createBuffer(bytes);
            var cipher = forge.aes.createDecryptionCipher(key, 'CBC');
            cipher.start(iv);
            cipher.update(buffer);
            cipher.finish();
            // outputs decrypted hex
            return cipher.output.data;
        }

        this.privateKeySign = function(message) {
            var md = forge.md.sha256.create();
            md.update(message);
            return service.privateKeyObject.sign(md);
        }

        this.privateKeyDecrypt = function(message) {
            return service.privateKeyObject.decrypt(message);
        }

        this.encryptPKMessage = function(public_key, message) {
            var iv = forge.random.getBytesSync(16);
            var key = forge.random.getBytesSync(32);

            var encMessage = service.encrypt(message, iv, key);
            var pk = forge.pki.publicKeyFromPem(public_key);
            var encKey = pk.encrypt(key);

            console.log("Message params:");
            console.log(iv);
            console.log(encKey);
            console.log(encMessage);

            return {
                iv: iv,
                key: encKey,
                message: encMessage
            };
        }

    }]);
