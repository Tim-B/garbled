'use strict';

angular.module('garbledApp')
    .controller('AddCtrl', ["$scope", "Contactservice", "$rootScope", "$http",
        function ($scope, Contactservice, $rootScope, $http) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.token = null;
            $scope.add = function () {
                topbar.show();
                try {
                    var tokenJson = forge.util.decode64($scope.token);
                    var tokenObject = angular.fromJson(tokenJson);
                    $http.get(tokenObject.url, {transformResponse: function (data) {
                        return data
                    }}).success(function (data) {
                            var md = forge.md.sha256.create();
                            md.update(data);
                            var hash = md.digest().toHex();
                            if (hash == tokenObject.hash) {
                                var identityData = angular.fromJson(data);
                                var contact = {
                                    displayName: identityData.displayName,
                                    inbox: identityData.inbox,
                                    publicKey: identityData.publicKey
                                };
                                Contactservice.fb.$add(contact);
                                $rootScope.notify.log('Contact ' + contact.displayName + ' added.');
                                $scope.token = '';
                                topbar.hide();
                            } else {
                                $rootScope.notify.log('Contact failed validation.');
                                topbar.hide();
                            }
                        });
                } catch (err) {
                    $rootScope.notify.log('Contact failed validation.');
                    topbar.hide();
                }
            }
        }]);
