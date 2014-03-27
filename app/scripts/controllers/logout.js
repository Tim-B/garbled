'use strict';

angular.module('garbledApp')
    .controller('LogoutCtrl', function ($scope, $rootScope, $location, config, Storagelogin) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        console.log('test');
        topbar.show();
        Storagelogin.auth.logout();
        $rootScope.notify.log('You have been logged out.');
        $rootScope.user = null;
    });
