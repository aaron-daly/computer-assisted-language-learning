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
                controller: 'MainController',
                restricted: false
            })

            // login page
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController',
                restricted: false
            })
            .when('/scenarioGame/:name', {
                templateUrl: 'views/scenarioGame.html',
                controller: 'ScenarioGameController',
                restricted: true,
                resolve: {
                    scenarioPromise: ['scenarioGame', '$q', '$timeout', '$route',
                        function(scenarioGame, $q, $timeout, $route) {
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
                controller: 'RegisterController',
                restricted: false
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
                            $timeout(function() {
                                teacher.getGroup(token.currentUserCreator());
                                defer.resolve();
                            });
                            return defer.promise;
                        }],
                    permissionPromise: ['$q', '$location', 'auth',
                        function($q, $location, auth) {
                            var defer = $q.defer();
                            auth.authorizePermission(2, function(authorized) {
                                if(!authorized) {
                                    $location.path('/teacher');
                                }
                                defer.resolve();
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
                    pupilPromise: ['$q','$timeout', 'teacher',
                        function($q, $timeout, teacher) {
                            var defer = $q.defer();
                            $timeout(function() {
                                teacher.getPupils();
                                defer.resolve();
                            },1000);
                            return defer.promise;
                        }],
                    groupPromise: ['$q', '$timeout', 'token', 'teacher',
                        function($q, $timeout, token, teacher) {
                            var defer = $q.defer();
                            $timeout(function() {
                                teacher.getGroup(token.currentUserId());
                                defer.resolve();
                            });
                            return defer.promise;
                        }],
                    permissionPromise: ['$q', '$location', 'auth',
                        function($q, $location, auth) {
                            var defer = $q.defer();
                            auth.authorizePermission(1, function(authorized) {
                                if(!authorized) {
                                    $location.path('/profile');
                                }
                                defer.resolve();
                            });
                            return defer.promise;
                        }]
                }
            })

            .when('/addScenario', {
                templateUrl: 'views/addScenario.html',
                controller: 'AddScenarioController',
                restricted: true,
                resolve: {
                    permissionPromise: ['$q', '$location', 'auth',
                        function($q, $location, auth) {
                            var defer = $q.defer();
                            auth.authorizePermission(1, function(authorized) {
                                if(!authorized) {
                                    $location.path('/profile');
                                }
                                defer.resolve();
                            });
                            return defer.promise;
                        }]
                }
            })

            .otherwise({
                redirectTo: '/',
                restricted: false
            });

        $locationProvider.html5Mode(true);

    }
]).run(['$rootScope', '$location', '$timeout', '$q', 'token',
    function($rootScope, $location, $timeout, $q, token) {


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