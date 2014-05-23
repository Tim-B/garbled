'use strict';

angular.module('garbledApp')
    .service('Chatservice', ["$firebase", "$rootScope", "Keyservice", "Identityservice",
        function Chatservice($firebase, $rootScope, Keyservice, Identityservice) {
            this.fb = null;
            return {
                getChat: function (contact) {
                    this.contact = contact;
                    this.messages = contact.$child('messages');
                    this.inbox = $firebase(new Firebase(contact.inbox));
                    var chat = this;
                    this.sendMessage = function (message) {
                        var iv = forge.random.getBytesSync(16);
                        var encMessage = Keyservice.encrypt(message, iv);

                        var myMessage = {from: Identityservice.fb.displayName, message: encMessage, iv: iv};

                        var signature = Keyservice.privateKeySign(message);
                        var theirMessage = {fingerPrint: Identityservice.getFingerPrint(), message: message, signature: signature};
                        var messageJSON = JSON.stringify(theirMessage);
                        var encryptedInboxMessage = Keyservice.encryptPKMessage(chat.contact.publicKey, messageJSON);

                        console.log(Identityservice.getPublicKey());
                        console.log(Identityservice.getFingerPrint());
                        chat.messages.$add(myMessage);
                        chat.inbox.$add(encryptedInboxMessage);
                    }
                    return this;
                }
            };
        }]);
