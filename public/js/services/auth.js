/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('calliApp')
    .factory('auth', ['$http', '$location', 'token', '$window',
        function($http, $location, token) {

            return {

                register: function(user, callback) {
                    return $http.post('/register', user)
                        .success(function(data) {
                            if(!token.getToken()) {
                                $location.path('/profile');
                                token.saveToken(data.token);
                            }
                        })
                        .error(function(error) {
                            if(!token.getToken()) {
                                $location.path('/register');
                            }
                            callback(error);
                        });
                },

                login: function(user, callback) {
                    return $http.post('/login', user)
                        .success(function(data) {
                            token.saveToken(data.token);
                            $location.path('profile');
                        })
                        .error(function(error) {
                            callback(error);
                            $location.path('/login');
                        });
                },

                logout: function() {
                    token.removeToken();
                    $location.path('/');
                },

                //*****TO DO
                authorize: function(role, callback) {
                    token.currentUserRole(function(data) {
                        if(role === data) {
                            callback(true);
                        }
                    });
                    callback(false);
                }

                /*
                 remove: function() {
                 return $http.post('/unregister', user)
                 .success(function(data) {
                 $window.localStorage.removeItem('calli-token');
                 $location.path('/');
                 })
                 .error(function() {
                 });
                 } */

            }
        }
    ]);