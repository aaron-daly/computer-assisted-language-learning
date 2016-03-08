// public/js/app.js
angular.module('calliApp', [
    'ngRoute',
    'angularUtils.directives.dirPagination',
    'MainCtrl',
    'NavigationCtrl',
    'LoginCtrl',
    'RegisterCtrl',
    'Mini2Ctrl',
    'Mini3Ctrl',
    'ConversationGameCtrl',
    'ProfileCtrl',
    'WordGameCtrl',
    'PictureGameCtrl',
    'TeacherCtrl',
    'AddScenarioCtrl'
]).config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {

        $routeProvider
            // home page
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainController',
                resolve: {
                    loginPromise: ['token', '$q', '$timeout', '$location',
                        function (token, $q, $timeout, $location) {
                            var defer = $q.defer();
                            $timeout(function () {
                                token.currentUserRole(function(role) {
                                    if(role === 'student' || role === 'pupil') {
                                        $location.path('/profile');
                                    } else if(role === 'teacher') {
                                        $location.path('/teacher');
                                    }
                                    defer.resolve();
                                });
                            });
                            return defer.promise;
                        }]
                }
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

            .when('/wordGame/:name', {
                templateUrl: 'views/wordGame.html',
                controller: 'WordGameController',
                restricted: true,
                resolve: {
                    scenarioPromise: ['wordGame', '$q', '$timeout', '$route', function(wordGame, $q, $timeout, $route) {
                        var defer = $q.defer();

                        //if game scenariolist is empty, preload (for game page refresh)
                        if(wordGame.scenarioList.length < 1) {
                            wordGame.preload();
                        }

                        var str = $route.current.params.name;
                        var name = str.substr(1, str.length);

                        $timeout(function() {
                            wordGame.loadScenario(name, function(data) {
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
            .when('/pictureGame/:name', {
                templateUrl: 'views/pictureGame.html',
                controller: 'PictureGameController',
                restricted: true,
                resolve: {
                    scenarioPromise: ['pictureGame', '$q', '$timeout', '$route', function(pictureGame, $q, $timeout, $route) {
                        var defer = $q.defer();

                        //if game scenariolist is empty, preload (for game page refresh)
                        if(pictureGame.scenarioList.length < 1) {
                            pictureGame.preload();
                        }

                        var str = $route.current.params.name;
                        var name = str.substr(1, str.length);

                        $timeout(function() {
                            pictureGame.loadScenario(name, function(data) {
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
            .when('/conversationGame/:name', {
                templateUrl: 'views/conversationGame.html',
                controller: 'ConversationGameController',
                restricted: true,
                resolve: {
                    scenarioPromise: ['conversationGame', '$q', '$timeout', '$route', function (conversationGame, $q, $timeout, $route) {
                        var defer = $q.defer();

                        //if game scenariolist is empty, preload (for game page refresh)
                        if (conversationGame.scenarioList.length < 1) {
                            conversationGame.preload();
                        }

                        var str = $route.current.params.name;
                        var name = str.substr(1, str.length);

                        $timeout(function () {
                            conversationGame.loadScenario(name, function (data) {
                                if (data) {
                                    defer.resolve('Scenario loaded');
                                } else {
                                    $location.path('/profile');
                                    defer.resolve('Error loading scenario');
                                }
                            },1000);
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
                    scenarioPromise: ['conversationGame', 'pictureGame', 'wordGame', '$q', '$timeout',
                        function (conversationGame, pictureGame, wordGame, $q, $timeout) {
                            var defer = $q.defer();
                            $timeout(function () {
                                conversationGame.preload();
                                pictureGame.preload();
                                wordGame.preload();
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
                    scenarioPromise: ['conversationGame', 'pictureGame', 'wordGame', '$q', '$timeout',
                        function (conversationGame, pictureGame, wordGame, $q, $timeout) {
                            var defer = $q.defer();
                            $timeout(function () {
                                conversationGame.preload();
                                pictureGame.preload();
                                wordGame.preload();
                                defer.resolve();
                            });
                            return defer.promise;
                        }],
                    pupilPromise: ['$q','$timeout', 'auth', 'teacher',
                        function($q, $timeout, auth, teacher) {
                            var defer = $q.defer();
                            auth.authorize('teacher', function(authorized) {
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
                            auth.authorize('teacher', function(authorized) {
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

]).run(['$rootScope', '$location', 'token', 'conversationGame', 'pictureGame', 'wordGame', 'auth', 'teacher',
    function($rootScope, $location, token, conversationGame, pictureGame, wordGame, auth, teacher) {


        //on route change...
        $rootScope.$on('$routeChangeStart', function(event, nextRoute) {

            //authenticate user is logged in for restricted pages
            if(nextRoute.$$route.restricted) {
                if(!token.isLoggedIn()) {
                    $location.path('/login');
                }
            }


            //if next route is profile page, preload list of games
            if(nextRoute.$$route.originalPath == '/profile' || nextRoute.$$route.originalPath == '/teacher') {

                conversationGame.preload();
                pictureGame.preload();
                wordGame.preload();

                auth.authorize('teacher', function(authorized) {
                    if(authorized) {
                        teacher.getPupils();
                    }
                });

            }

        });
    }
]);