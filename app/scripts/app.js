'use strict';

angular.module('garbledApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'firebase',
    ])
    .value('config', {
        'fb_ref': new Firebase('https://sweltering-fire-9426.firebaseio.com/chat')
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
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
    })
    .run(function ($rootScope, $location, Storagelogin) {
        topbar.show();
        $rootScope.notify = humane.create({ timeout: 4000, baseCls: 'humane-flatty' });
        $rootScope.user = null;
        $rootScope.$on("logged-in", function (user) {
            $rootScope.user = user;
            $rootScope.notify.log('You have been logged in.');
            topbar.hide();
            console.log("Before path");
            $location.path("/");
            console.log("After path");
        });
        $rootScope.$on("login-error", function (error) {
            $rootScope.notify.log('Login failed');
            topbar.hide();
        });
        $rootScope.$on("logged-out", function () {
            topbar.hide();
            $location.path("/login");
        });
        /*
        // register listener to watch route changes
        $rootScope.$on("$routeChangeStart", function (event, next, current) {

            if ($rootScope.user == null) {
                // no logged user, we should be going to #login
                if (next.templateUrl != "views/login.html" && next.templateUrl != "views/register.html") {
                    $rootScope.notify.log('You must log in first.');
                    $location.path("/login");
                }
            }

        });
         */
    });
