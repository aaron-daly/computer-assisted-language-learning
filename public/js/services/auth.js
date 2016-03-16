/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('calliApp')
    .factory('auth', ['$http', '$location', 'token', '$window',
        function($http, $location, token) {

            return {

                // register user, callback register error if error
                register: function(user, callback) {
                    return $http.post('/register', user)
                        .success(function(data) {
                            if(!token.getToken()) {
                                token.saveToken(data.token);
                                // if registered, sign up teacher's group
                                $http.post('/group', { teacherId: token.currentUserId() })
                                    .success(function(data){
                                        console.log(data);
                                    })
                                    .error(function(error){
                                        console.log(error);
                                    });
                                $location.path('/teacher');
                            }
                            callback(data);
                        })
                        .error(function(error) {
                            callback(error);
                            if(!token.getToken()) {
                                $location.path('/register');
                            }
                        });
                },

                // login user, callback login error if error
                login: function(user, callback) {
                    return $http.post('/login', user)
                        .success(function(data) {
                            token.saveToken(data.token);
                            $location.path('/profile'); // set location to pupil profile, route will redirect if teacher...
                        })
                        .error(function(error) {
                            callback(error);
                            $location.path('/login');
                        });
                },


                //logout user, remove session token
                logout: function() {
                    token.removeToken();
                    $location.path('/');
                },

                //authorize permission level of user, callback true or false
                authorizePermission: function(permission, authorized) {
                    token.currentUserPermission(function(userPermission) {
                        if(userPermission == permission) {
                            authorized(true);
                        } else {
                            authorized(false);
                        }
                    })
                }

            }
        }
    ]);