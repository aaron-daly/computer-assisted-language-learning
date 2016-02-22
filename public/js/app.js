// public/js/app.js
angular.module('calliApp', [
    'ngRoute',
    'MainCtrl',
    'LoginCtrl',
    'RegisterCtrl',
    'PreviewCtrl'
]).config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {

        $routeProvider
            // home page
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainController'
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
            });
        $locationProvider.html5Mode(true);

    }
]);