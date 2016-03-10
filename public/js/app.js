// public/js/app.js
angular.module('calliApp', [
    'ngRoute',
    'angularUtils.directives.dirPagination',
    'MainCtrl',
    'NavigationCtrl',
    'LoginCtrl',
    'RegisterCtrl',
    'ProfileCtrl',
    'TeacherCtrl',
    'ScenarioGameCtrl',
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
            .when('/scenarioGame/:name', {
                templateUrl: 'views/scenarioGame.html',
                controller: 'ScenarioGameController',
                restricted: true,
                resolve: {
                    scenarioPromise: ['scenarioGame', '$q', '$timeout', '$route', function(scenarioGame, $q, $timeout, $route) {
                        var defer = $q.defer();

                        //if game scenariolist is empty, preload (for game page refresh)
                        if(scenarioGame.scenarioList.length < 1) {
                            scenarioGame.preload();
                        }

                        var str = $route.current.params.name;
                        var name = str.substr(1, str.length);

                        $timeout(function() {
                            scenarioGame.loadScenario(name, function(data) {
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
                    scenarioPromise: ['scenarioGame', '$q', '$timeout',
                        function (scenarioGame, $q, $timeout) {
                            var defer = $q.defer();
                            $timeout(function () {
                                scenarioGame.preload();
                                defer.resolve();
                            },1000);
                            return defer.promise;
                        }],
                    groupPromise: ['$q', '$timeout', 'auth', 'token', 'teacher',
                        function($q, $timeout, auth, token, teacher) {
                            var defer = $q.defer();


                            //if student
                            auth.authorize('student', function(authorized) {
                                $timeout(function() {
                                    teacher.getGroup(token.currentUserCreator());
                                    defer.resolve();
                                })
                            });


                            return defer.promise;
                        }]
                }
            })

            .when('/teacher', {
                templateUrl: 'views/teacher.html',
                controller: 'TeacherController',
                restricted: true,
                resolve: {
                    scenarioPromise: ['scenarioGame', '$q', '$timeout',
                        function (scenarioGame, $q, $timeout) {
                            var defer = $q.defer();
                            $timeout(function () {
                                scenarioGame.preload();
                                defer.resolve();
                            });
                            return defer.promise;
                        }],
                    pupilPromise: ['$q','$timeout', 'auth', 'teacher',
                        function($q, $timeout, auth, teacher) {
                            var defer = $q.defer();
                            auth.authorize('Teacher', function(authorized) {
                                $timeout(function() {
                                    teacher.getPupils();
                                    defer.resolve();
                                },1000);
                            });
                            return defer.promise;
                        }],
                    groupPromise: ['$q', '$timeout', 'auth', 'token', 'teacher',
                        function($q, $timeout, auth, token, teacher) {
                            var defer = $q.defer();

                            //if teacher
                            auth.authorize('Teacher', function(authorized) {
                                $timeout(function() {
                                    teacher.getGroup(token.currentUserId());
                                    defer.resolve();
                                });
                            });
                            return defer.promise;
                        }]

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

]).run(['$rootScope', '$location', '$timeout', '$q', 'token','auth', 'teacher',
    function($rootScope, $location, $timeout, $q, token, auth, teacher) {


        //on route change...
        $rootScope.$on('$routeChangeStart', function(event, nextRoute) {

            //authenticate user is logged in for restricted pages
            if(nextRoute.$$route.restricted) {
                if(!token.isLoggedIn()) {
                    $location.path('/login');
                }
            }

            /*if next route is profile page, preload list of games
            if(nextRoute.$$route.originalPath === '/profile' || nextRoute.$$route.originalPath === '/teacher') {

                conversationGame.preload();
                pictureGame.preload();
                wordGame.preload();

                auth.authorize('teacher', function(authorized) {
                    if(authorized) {
                        teacher.getPupils();
                    }
                });

            } */

        });
    }
]);