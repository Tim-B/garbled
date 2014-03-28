'use strict';

angular.module('garbledApp')
    .controller('AddCtrl', function ($scope, Contactservice, $rootScope, $http) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.token = null;
        $scope.add = function () {
            topbar.show();
            try {
                var tokenComponents = CryptoJS.enc.Base64.parse($scope.token);
                var tokenString = CryptoJS.enc.Utf16.stringify(tokenComponents);
                var tokenObject = angular.fromJson(tokenString);
                console.log(tokenObject);
                $http.get(tokenObject.url, {transformResponse: function (data) {
                    return data
                }}).success(function (data) {
                    var hash = CryptoJS.SHA3(data, { outputLength: 256 }).toString();
                    if (hash == tokenObject.hash) {
                        var identityData = angular.fromJson(data);
                        var contact = {
                            displayName: identityData.displayName,
                            inbox: identityData.inbox
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
    });
