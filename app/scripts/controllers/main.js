'use strict';

angular.module('garbledApp')
    .controller('MainCtrl', ["$scope", "config", "Chatservice", "Contactservice", "$timeout", "Inboxservice", "Identityservice", "Keyservice",
        function ($scope, config, Chatservice, Contactservice, $timeout, Inboxservice, Identityservice, Keyservice) {

            $scope.contacts = Contactservice.fb;
            $scope.chat = null;

            $scope.loadChat = function (contact) {
                $scope.chat = Chatservice.getChat($scope.contacts.$child(contact));
                $scope.chat.messages.$on('child_added', function (childSnapshot, prevChildName) {
                    $timeout(function () {
                        var objDiv = document.getElementById("message-container");
                        objDiv.scrollTop = objDiv.scrollHeight + 60;
                    });
                });
            }

            $scope.submitMessage = function () {
                $scope.chat.sendMessage($scope.newMessage);
                $scope.newMessage = "";
            }

            $scope.decryptItem = function (message) {
                var json = Keyservice.decrypt(message.message, message.iv);
                var message = JSON.parse(json);

                return message;
            }

            $scope.decryptContact = function (contact) {
                var json = Keyservice.decrypt(contact.identity, contact.iv);
                var contact = JSON.parse(json);
                return contact;
            }

        }]);
