angular.module('calliApp')
    .factory('token', ['$http', '$window',
        function($http, $window){

            var token = {};

            token.saveToken = function (token){
                $window.localStorage['calli-token'] = token;
            };

            token.getToken = function (){
                return $window.localStorage['calli-token'];
            };

            token.removeToken = function() {
                return $window.localStorage.removeItem('calli-token');
            };

            token.isLoggedIn = function(){

                var userToken = token.getToken();
                var currentDate = Date.now();

                if(userToken){
                    var user = JSON.parse($window.atob(userToken.split('.')[1]));
                    return user.exp > currentDate/1000;
                } else {
                    return false;
                }
            };

            token.currentUser = function(){
                if(token.isLoggedIn()){
                    var userToken = token.getToken();
                    var user = JSON.parse($window.atob(userToken.split('.')[1]));
                    return user.username;
                }
            };
            token.currentUserId = function(){
                if(token.isLoggedIn()){
                    var userToken = token.getToken();
                    var user = JSON.parse($window.atob(userToken.split('.')[1]));
                    return user._id;
                }
            };
            /* NOT WORKING, MUST COME BACK TO
            token.currentUserRole = function(){
                if(token.isLoggedIn()){
                    var userToken = token.getToken();
                    var payload = JSON.parse($window.atob(userToken.split('.')[1]));
                    return payload.role;
                }
            }; */

            return token;
        }
    ]);
