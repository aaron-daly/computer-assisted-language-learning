// public/js/app.js
angular.module('calliApp', [
    'ngRoute',
    'MainCtrl',
    'NavigationCtrl',
    'LoginCtrl',
    'RegisterCtrl',
    'Mini2Ctrl',
    'Mini3Ctrl',
    'ConversationGameCtrl',
    'ProfileCtrl',
    'AddScenarioCtrl'
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
            .when('/conversationGame/:name', {
                templateUrl: 'views/conversationGame.html',
                controller: 'ConversationGameController',
                restricted: true,
                resolve: {
                    scenarioPromise: ['conversationGame', '$q', '$timeout', '$route', function(conversationGame, $q, $timeout, $route) {
                        var defer = $q.defer();

                        //if game scenariolist is empty, preload (for game page refresh)
                        if(conversationGame.scenarioList.length < 1) {
                            conversationGame.preload();
                        }

                        var str = $route.current.params.name;
                        var name = str.substr(1, str.length);

                        $timeout(function() {
                            conversationGame.loadScenario(name, function(data) {
                                if(data) {
                                    defer.resolve('Scenario loaded');
                                } else {
                                    $location.path('/profile');
                                    defer.resolve('Error loading scenario');
                                }
                            });
                        });

                        return defer.promise;
                    }]
                }
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
                restricted: true,
                resolve: {
                    pupilPromise: ['$q','$timeout', 'auth', function($q, $timeout, auth) {
                        if(auth.authorize('teacher')) {
                            console.log('hello');
                        }
                    }],
                    scenarioPromise: ['conversationGame', '$q', '$timeout', function (conversationGame, $q, $timeout) {

                        var defer = $q.defer();

                        $timeout(function () {
                            conversationGame.preload();
                            defer.resolve();
                        });

                        return defer.promise;
                    }]

                    /*
                    pupilsPromise: ['$q', '$timeout', 'pupils', function($q, $timeout, pupils) {

                    }],

                    userPromise: ['$q', '$timeout', 'user', function($q, $timeout, user) {

                    }] */
                }
            })

            .when('/addScenario', {
                templateUrl: 'views/addScenario.html',
                controller: 'AddScenarioController'
            })

            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

    }
]).run(['$rootScope', '$location', 'token',
    function($rootScope, $location, token) {

        //on route change...
        $rootScope.$on('$routeChangeStart', function(event, nextRoute) {

            //authenticate user is logged in for restricted pages
            if(nextRoute.$$route.restricted) {
                if(!token.isLoggedIn()) {
                    $location.path('/login');
                }
            }


            //if next route is profile page, preload list of games
            if(nextRoute.$$route.originalPath == '/profile') {
                conversationGame.preload();
            }


        });
    }
]);