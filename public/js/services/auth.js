/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('calliApp')
    .factory('auth', ['$http', '$location',
        function($http, $location) {
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
                login : function(user) {
                    return $http.post('/login', user)
                        .success(function(data) {
                            $location.path('profile');
                        })
                        .error(function() {
                            $location.path('/login');
                        })
                }
            }
        }
    ]);