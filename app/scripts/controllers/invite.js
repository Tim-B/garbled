'use strict';

angular.module('garbledApp')
    .controller('InviteCtrl', function ($scope, $rootScope, Identityservice) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.token = '';

        $rootScope.$on("logged-in", function (user) {
            var identity = Identityservice.fb.$getRef().once('value', function (dataSnapshot) {
                var idJson = angular.toJson(dataSnapshot.val());
                var hash = CryptoJS.SHA3(idJson, { outputLength: 256 }).toString();
                var tokenComponents = {
                    url: Identityservice.fb.$getRef().toString() + '.json',
                    hash: hash
                }
                var tokenJson = angular.toJson(tokenComponents).toString();
                var wordArray = CryptoJS.enc.Utf16.parse(tokenJson);
                $scope.token = CryptoJS.enc.Base64.stringify(wordArray);
            });
        });

    });
