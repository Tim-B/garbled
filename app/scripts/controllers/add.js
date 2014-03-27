'use strict';

angular.module('garbledApp')
    .controller('AddCtrl', function ($scope, Contactservice) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.token = null;
        $scope.add = function () {
            var parsed = angular.fromJson($scope.token);
            var contact = {
                displayName: parsed.displayName,
                endPoint: parsed.endPoint
            };
            Contactservice.fb.$add(contact);
        }
    });
