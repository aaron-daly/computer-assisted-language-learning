// public/js/app.js
angular.module('calliApp', [
    'ngRoute',
    'MainCtrl',
    'NavigationCtrl',
    'LoginCtrl',
    'RegisterCtrl',
    'PreviewCtrl',
    'Mini2Ctrl',
    'Mini3Ctrl',
    'GameCtrl',
    'ProfileCtrl'
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
            // mini2 page
            .when('/mini2', {
                templateUrl: 'views/mini2.html',
                controller: 'Mini2Controller'
            })
            // mini2 page
            .when('/mini3', {
                templateUrl: 'views/mini3.html',
                controller: 'Mini3Controller'
            })
            .when('/game', {
                templateUrl: 'views/game.html',
                controller: 'GameController',
                restricted: true
            })
            // register page
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterController'
            })
            // user profile page
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileController',
                restricted: true
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

    }
]).run(['$rootScope', '$location', 'token',
    function($rootScope, $location, token) {

        //on route change, authenticate user is logged in for restricted pages
        $rootScope.$on('$routeChangeStart', function(event, nextRoute) {
            if(nextRoute.$$route.restricted) {
                if(!token.isLoggedIn()) {
                    $location.path('/login');
                }
            }
        });
    }
]);