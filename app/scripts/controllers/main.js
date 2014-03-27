'use strict';

angular.module('garbledApp')
    .controller('MainCtrl', function ($scope, Chatservice) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.user = "Fred Frog " + Math.round(Math.random()*101);
        $scope.newMessage = "";
        $scope.messages = Chatservice;

        $scope.submitMessage = function() {
            $scope.messages.$add({from: $scope.user, message: $scope.newMessage});
            $scope.newMessage = "";
        }
    });
