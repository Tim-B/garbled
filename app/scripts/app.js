'use strict';

angular.module('garbledApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'firebase',
    ])
    .value('config', {
        'fb_ref': new Firebase('https://sweltering-fire-9426.firebaseio.com')
    })
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    login: function (Storagelogin) {

                    },
                    identity: function (Identityservice) {
                        return Identityservice.promise;
                    },
                    contacts: function (Contactservice) {
                        return Contactservice.promise;
                    }
                }
            })
            .when('/chat/:contactId', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    login: function (Storagelogin) {

                    },
                    identity: function (Identityservice) {
                        return Identityservice.promise;
                    },
                    contacts: function (Contactservice) {
                        return Contactservice.promise;
                    }
                }
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/invite', {
                templateUrl: 'views/invite.html',
                controller: 'InviteCtrl',
                resolve: {
                    identity: function (Identityservice) {
                        return Identityservice.promise;
                    }
                }
            })
            .when('/add', {
                templateUrl: 'views/add.html',
                controller: 'AddCtrl'
            })
            .when('/logout', {
                templateUrl: 'views/login.html',
                controller: 'LogoutCtrl'
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .run(["$rootScope", "$location", function ($rootScope, $location) {
        topbar.show();
        $rootScope.notify = humane.create({ timeout: 4000, baseCls: 'humane-flatty' });
        $rootScope.user = null;
        $rootScope.$on("logged-in", function (user) {
            $rootScope.user = user;
            topbar.hide();
        });
        $rootScope.$on("login-error", function (error) {
            $rootScope.notify.log('Login failed');
            topbar.hide();
        });
        $rootScope.$on("logged-out", function () {
            topbar.hide();
            if ($location.path() != "/login" && $location.path() != "/register") {
                $location.path("/login");
            }
        });
    }]);
