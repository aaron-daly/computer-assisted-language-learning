/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('calliApp')
    .factory('auth', ['$http', '$location', 'token', '$window',
        function($http, $location, token, $window) {
            return {
                register: function(user) {
                    return $http.post('/register', user)
                        .success(function(data) {
                            $location.path('/profile');
                        })
                        .error(function() {
                            $location.path('/register');
                        });
                },
                login: function(user) {
                    return $http.post('/login', user)
                        .success(function(data) {
                            console.log('successful login: ' + data.token);
                            token.saveToken(data.token);
                            $location.path('profile');
                        })
                        .error(function() {
                            $location.path('/login');
                        })
                },
                logout: function() {
                    return $http.get('/logout')
                        .success(function() {
                            $window.localStorage.removeItem('calli-token');
                            $location.path('/');
                        });
                }
            }
        }
    ]);