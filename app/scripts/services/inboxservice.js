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
                        var contact = Contactservice.findByFingerPrint(message.fingerPrint);
                        var chatMessage = Chatservice.getChat(contact).messages.$child(key);

                        var messageKey = Keyservice.privateKeyDecrypt(chatMessage.key);
                        var iv = chatMessage.iv;
                        var messageJSON = Keyservice.decrypt(chatMessage.message, iv, messageKey);
                        console.log(messageJSON);

                        chatMessage.$transaction(function (chatMessage) {

                            var iv = forge.random.getBytesSync(16);

                            return {
                                from: contact.displayName,
                                iv: iv,
                                message: Keyservice.encrypt(message.message, iv)
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
