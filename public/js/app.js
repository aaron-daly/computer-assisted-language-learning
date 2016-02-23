// public/js/app.js
angular.module('calliApp', [
    'ngRoute',
    'MainCtrl',
    'NavigationCtrl',
    'LoginCtrl',
    'RegisterCtrl',
    'PreviewCtrl',
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