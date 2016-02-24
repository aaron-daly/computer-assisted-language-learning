// public/js/app.js
angular.module('calliApp', [
    'ngRoute',
    'MainCtrl',
    'NavigationCtrl',
    'LoginCtrl',
    'RegisterCtrl',
    'PreviewCtrl',
    'Mini2Ctrl',
    'ProfileCtrl'
]).config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {

        $routeProvider
            // home page
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainController',
            })
            // login page
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })
            // preview page
            .when('/preview', {
                templateUrl: 'views/preview.html',
                controller: 'PreviewController'
            })
            // mini2 page
            .when('/mini2', {
                templateUrl: 'views/mini2.html',
                controller: 'Mini2Controller'
            })
            // register page
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterController'
            })
            // user profile page
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileController'
            });
        $locationProvider.html5Mode(true);

    }
]);