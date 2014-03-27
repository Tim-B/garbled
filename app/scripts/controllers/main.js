'use strict';

angular.module('garbledApp')
    .controller('MainCtrl', function ($scope, config, Chatservice, $timeout) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.user = "Fred Frog " + Math.round(Math.random() * 101);
        $scope.newMessage = "";
        $scope.messages = Chatservice;

        config.fb_ref.on('child_added', function (childSnapshot, prevChildName) {
            $timeout(function () {
                var objDiv = document.getElementById("message-container");
                objDiv.scrollTop = objDiv.scrollHeight + 60;
                console.log("New");
            });
        });

        $scope.submitMessage = function () {
            $scope.messages.$add({from: $scope.user, message: $scope.newMessage});
            $scope.newMessage = "";
        }
    });
