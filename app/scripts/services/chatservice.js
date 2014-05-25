'use strict';

angular.module('garbledApp')
    .service('Chatservice', ["$firebase", "$rootScope", "Keyservice", "Identityservice",
        function Chatservice($firebase, $rootScope, Keyservice, Identityservice) {
            this.fb = null;

            this.getIdentity = function (contact) {

                var json = Keyservice.decrypt(contact.identity, contact.iv);
                var identityJSON = JSON.parse(json);
                return identityJSON
            }

            var service = this;

            return {
                getChat: function (contact) {
                    this.contact = contact;
                    this.messages = contact.$child('messages');

                    var identity = service.getIdentity(contact);

                    this.inbox = $firebase(new Firebase(identity.inbox));
                    var chat = this;
                    this.sendMessage = function (message) {
                        var iv = forge.random.getBytesSync(16);

                        var messageParcel = {from: Identityservice.fb.displayName, message: message};
                        var messageJson = JSON.stringify(messageParcel);
                        var encMessage = Keyservice.encrypt(messageJson, iv);

                        var myMessage = {message: encMessage, iv: iv};

                        var signature = Keyservice.privateKeySign(message);
                        var theirMessage = {fingerPrint: Identityservice.getFingerPrint(), message: message, signature: signature};
                        var messageJSON = JSON.stringify(theirMessage);
                        var encryptedInboxMessage = Keyservice.encryptPKMessage(identity.publicKey, messageJSON);

                        console.log(Identityservice.getPublicKey());
                        console.log(Identityservice.getFingerPrint());
                        chat.messages.$add(myMessage);
                        chat.inbox.$add(encryptedInboxMessage);
                    }
                    return this;
                }
            };
        }]);
