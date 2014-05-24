'use strict';

angular.module('garbledApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'LocalStorageModule',
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
                    login: ["Storagelogin", function (Storagelogin) {

                    }],
                    key: ["Keyservice", function (Keyservice) {
                        return Keyservice.promise;
                    }],
                    identity: ["Identityservice", function (Identityservice) {
                        return Identityservice.promise;
                    }],
                    contacts: ["Contactservice", function (Contactservice) {
                        return Contactservice.promise;
                    }]
                }
            })
            .when('/chat/:contactId', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    login: ["Storagelogin", function (Storagelogin) {

                    }],
                    key: ["Keyservice", function (Keyservice) {
                        return Keyservice.promise;
                    }],
                    identity: ["Identityservice", function (Identityservice) {
                        return Identityservice.promise;
                    }],
                    contacts: ["Contactservice", function (Contactservice) {
                        return Contactservice.promise;
                    }]
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
                    login: ["Storagelogin", function (Storagelogin) {

                    }],
                    key: ["Keyservice", function (Keyservice) {
                        return Keyservice.promise;
                    }],
                    identity: ["Identityservice", function (Identityservice) {
                        return Identityservice.promise;
                    }],
                    contacts: ["Contactservice", function (Contactservice) {
                        return Contactservice.promise;
                    }]
                }
            })
            .when('/add', {
                templateUrl: 'views/add.html',
                controller: 'AddCtrl',
                resolve: {
                    login: ["Storagelogin", function (Storagelogin) {

                    }],
                    key: ["Keyservice", function (Keyservice) {
                        return Keyservice.promise;
                    }],
                    identity: ["Identityservice", function (Identityservice) {
                        return Identityservice.promise;
                    }],
                    contacts: ["Contactservice", function (Contactservice) {
                        return Contactservice.promise;
                    }]
                }
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
    .run(["$rootScope", "$location", "Storagelogin", function ($rootScope, $location, Storagelogin) {

        $rootScope.xor = function (length, val1, val2, val3) {
            var out = '';
            for (var i = 0; i < length; i++) {
                out += String.fromCharCode(val1.charCodeAt(i) ^ val2.charCodeAt(i) ^ val3.charCodeAt(i));
            }
            return out;
        }

        $rootScope.notify = humane.create({ timeout: 4000, baseCls: 'humane-flatty' });
        $rootScope.user = null;
        $rootScope.$on("logged-in", function (user) {

            $rootScope.user = user;

            var route = $location.path();

            if (route != '/login' && route != '/register' && $rootScope.userKey == undefined) {
                console.log('force logout');
                topbar.hide();
                Storagelogin.auth.logout();
            }
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
