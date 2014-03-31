'use strict';

angular.module('garbledApp')
    .controller('InviteCtrl', function ($scope, $rootScope, Identityservice) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.token = '';
        $scope.identity = null;

        $scope.generateToken = function () {
            var identityModel = Identityservice.fb;
            var identity = {
                publicKey: identityModel.publicKey,
                displayName: identityModel.displayName,
                inbox: identityModel.inbox
            };
            console.log(identityModel.displayName);
            var idJson = angular.toJson(identity);
            var md = forge.md.sha256.create();
            md.update(idJson);
            var hash = md.digest().toHex();
            var tokenComponents = {
                url: Identityservice.fb.$getRef().toString() + '.json',
                hash: hash
            }
            var tokenJson = angular.toJson(tokenComponents).toString();
            $scope.token = forge.util.encode64(tokenJson);
        }

        $scope.generateToken();

    });
