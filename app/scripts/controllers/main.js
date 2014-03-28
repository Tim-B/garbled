'use strict';

angular.module('garbledApp')
    .controller('MainCtrl', function ($scope, config, Chatservice, Contactservice, $timeout, Inboxservice) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.contacts = Contactservice.fb;
        $scope.chat = null;

        config.fb_ref.on('child_added', function (childSnapshot, prevChildName) {
            $timeout(function () {
                var objDiv = document.getElementById("message-container");
                objDiv.scrollTop = objDiv.scrollHeight + 60;
            });
        });

        $scope.loadChat = function(contact) {
            $scope.chat = Chatservice.getChat($scope.contacts.$child(contact));
        }

        $scope.submitMessage = function () {
            var message = {from: "Me", message: $scope.newMessage};
            console.log($scope.chat);
            $scope.chat.messages.$add(message);
            $scope.chat.inbox.$add(message);
            $scope.newMessage = "";
        }
    });
