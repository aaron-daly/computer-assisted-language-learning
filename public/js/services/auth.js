/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('calliApp')
    .factory('auth', ['$http', '$location', 'token', '$window', 'error',
        function($http, $location, token, $window, error) {
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
                            token.saveToken(data.token);
                            $location.path('profile');

                            console.log('successful login: ' + token.currentUser());
                        })
                        .error(function() {
                            error.setLoginError('Could not log in!');
                            $location.path('/login');
                        })
                },
                logout: function() {
                    console.log('Successful log out: ' + token.currentUser());

                    $window.localStorage.removeItem('calli-token');
                    $location.path('/');
                }
            }
        }
    ]);