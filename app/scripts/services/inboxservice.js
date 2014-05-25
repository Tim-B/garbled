'use strict';

angular.module('garbledApp')
    .service('Inboxservice', ["$firebase", "$rootScope", "Contactservice", "Chatservice", "Keyservice",
        function Inboxservice($firebase, $rootScope, Contactservice, Chatservice, Keyservice) {
            var service = this;
            service.fb = null;
            this.init = function () {
                service.fb = $firebase($rootScope.fb.child('inbox'));
                Contactservice.promise.then(function () {
                    service.fb.$on("change", function () {
                        service.processIncoming();
                    });
                });
            }
            this.processIncoming = function () {
                var keys = service.fb.$getIndex();
                keys.forEach(function (key, i) {
                    var message = service.fb.$child(key);
                    message.$on('loaded', function () {


                        var messageKey = Keyservice.privateKeyDecrypt(message.key);
                        var iv = message.iv;
                        var messageJSON = Keyservice.decrypt(message.message, iv, messageKey);
                        var messageObject = JSON.parse(messageJSON);

                        var contact = Contactservice.findByFingerPrint(messageObject.fingerPrint);
                        var chatMessage = Chatservice.getChat(contact).messages.$child(key);

                        chatMessage.$transaction(function (chatMessage) {

                            var iv = forge.random.getBytesSync(16);

                            var json = Keyservice.decrypt(contact.identity, contact.iv);
                            var identity = JSON.parse(json);

                            var messageParcel = {from: identity.displayName, message: messageObject.message};
                            var messageJson = JSON.stringify(messageParcel);
                            var encMessage = Keyservice.encrypt(messageJson, iv);


                            return {
                                iv: iv,
                                message: encMessage
                            };

                        }).then(function (snapshot) {
                                if (snapshot) {
                                    service.fb.$remove(key);
                                }
                            });
                    });
                });
            };
        }]);
