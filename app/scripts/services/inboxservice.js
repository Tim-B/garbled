'use strict';

angular.module('garbledApp')
    .service('Inboxservice', ["$firebase", "$rootScope", "Contactservice", "Chatservice",
        function Inboxservice($firebase, $rootScope, Contactservice, Chatservice) {
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

                        chatMessage.$transaction(function (chatMessage) {
                            return {
                                from: contact.displayName,
                                message: message.message
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
