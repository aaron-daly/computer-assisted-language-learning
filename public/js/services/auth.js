/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('calliApp')
    .factory('auth', ['$http', '$location', 'token', '$window',
        function($http, $location, token) {

            return {

                register: function(user) {
                    return $http.post('/register', user)
                        .success(function(data) {
                            $location.path('/profile');
                            token.saveToken(data.token);

                            console.log('successful registration: ' + token.currentUser());
                        })
                        .error(function() {
                            $location.path('/register');
                        });
                },

                login: function(user) {
                    return $http.post('/login', user)
                        .success(function(data) {
                            token.saveToken(data.token);
                            $location.path('profile');
                            console.log('successful login: ' + token.currentUser());
                        })
                        .error(function(error) {
                            console.log('error: ' + error.message);
                            $location.path('/login');
                        });
                },

                logout: function() {
                    console.log('Successful log out: ' + token.currentUser());
                    token.removeToken();
                    $location.path('/');
                },
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