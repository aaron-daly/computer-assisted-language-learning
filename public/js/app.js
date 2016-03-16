// public/js/app.js
angular.module('calliApp', [
    'ngRoute',
    'angularUtils.directives.dirPagination',
    'MainCtrl',
    'AboutCtrl',
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
                restricted: false,
                resolve: {
                    session: ['$location', 'token',
                        function($location, token) {
                            if(token.isLoggedIn()) {
                                $location.path('/profile');
                            }
                        }]
                }
            })

            //about page
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutController',
                restricted: false
            })

            // login page
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController',
                restricted: false
            })

            //scenario game page, scenario name as param
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

            // pupil profile page
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileController',
                restricted: true,
                resolve: {
                    // defer to preload games
                    scenarioPromise: ['scenarioGame', '$q', '$timeout',
                        function (scenarioGame, $q, $timeout) {
                            var defer = $q.defer();
                            $timeout(function () {
                                scenarioGame.preload();
                                defer.resolve();
                            },1000);
                            return defer.promise;
                        }],
                    // defer to load pupil's group
                    groupPromise: ['$q', '$timeout', 'auth', 'token', 'teacher',
                        function($q, $timeout, auth, token, teacher) {
                            var defer = $q.defer();
                            $timeout(function() {
                                teacher.getGroup(token.currentUserCreator());
                                defer.resolve();
                            });
                            return defer.promise;
                        }],
                    //defer to check permissions
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

            // teacher profile page
            .when('/teacher', {
                templateUrl: 'views/teacher.html',
                controller: 'TeacherController',
                restricted: true,
                resolve: {
                    // defer to preload games
                    scenarioPromise: ['scenarioGame', '$q', '$timeout',
                        function (scenarioGame, $q, $timeout) {
                            var defer = $q.defer();
                            $timeout(function () {
                                scenarioGame.preload();
                                defer.resolve();
                            });
                            return defer.promise;
                        }],
                    //defer to load teacher's pupils
                    pupilPromise: ['$q','$timeout', 'teacher',
                        function($q, $timeout, teacher) {
                            var defer = $q.defer();
                            $timeout(function() {
                                teacher.getPupils();
                                defer.resolve();
                            },1000);
                            return defer.promise;
                        }],
                    // defer to load teacher's group
                    groupPromise: ['$q', '$timeout', 'token', 'teacher',
                        function($q, $timeout, token, teacher) {
                            var defer = $q.defer();
                            $timeout(function() {
                                teacher.getGroup(token.currentUserId());
                                defer.resolve();
                            });
                            return defer.promise;
                        }],
                    // defer to check permissions
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

            // add scenario page
            .when('/addScenario', {
                templateUrl: 'views/addScenario.html',
                controller: 'AddScenarioController',
                restricted: true,
                resolve: {
                    // defer to check permissions
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
                        }],
                    //defer to load group scenarios
                    //TO ENSURE TEACHER'S GROUP IS PRELOADED...
                    scenarioPromise: ['$q', '$timeout', 'teacher', 'token',
                        function($q, $timeout, teacher, token) {
                            var defer = $q.defer();
                            $timeout( function(){
                                teacher.getGroup(token.currentUserId());
                                defer.resolve();
                            }, 1000);

                            return defer.promise;
                        }]
                }
            })

            //otherwise redirect to home
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
        });
    }
]);