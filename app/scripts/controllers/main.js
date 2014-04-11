'use strict';

angular.module('garbledApp')
    .controller('MainCtrl', ["$scope", "config", "Chatservice", "Contactservice", "$timeout", "Inboxservice", "Identityservice",
        function ($scope, config, Chatservice, Contactservice, $timeout, Inboxservice, Identityservice) {

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
                var myMessage = {from: Identityservice.fb.displayName, message: $scope.newMessage};
                var theirMessage = {fingerPrint: Identityservice.getFingerPrint(), message: $scope.newMessage};
                console.log(Identityservice.getPublicKey());
                console.log(Identityservice.getFingerPrint());
                $scope.chat.messages.$add(myMessage);
                $scope.chat.inbox.$add(theirMessage);
                $scope.newMessage = "";
            }

        }]);
