// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

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

}]);