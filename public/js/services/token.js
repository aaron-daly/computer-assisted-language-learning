angular.module('calliApp')

    .factory('token', ['$http', '$window',
        function($http, $window){

            var token = {};

            // save JWT to local storage
            token.saveToken = function (token){
                $window.localStorage['calli-token'] = token;
            };

            // get JWT from local storage
            token.getToken = function (){
                return $window.localStorage['calli-token'];
            };

            // remove JWT from local storage
            token.removeToken = function() {
                return $window.localStorage.removeItem('calli-token');
            };

            // check if a user is logged in
            token.isLoggedIn = function() {
                var userToken = token.getToken();
                var currentDate = Date.now();

                if(userToken){
                    var user = JSON.parse($window.atob(userToken.split('.')[1]));
                    return user.exp > currentDate/1000;
                } else {
                    return false;
                }
            };

            //get current user's username
            token.currentUser = function(){
                if(token.isLoggedIn()){
                    var userToken = token.getToken();
                    var user = JSON.parse($window.atob(userToken.split('.')[1]));
                    return user.username;
                }
            };

            //get current user's id
            token.currentUserId = function(){
                if(token.isLoggedIn()){
                    var userToken = token.getToken();
                    var user = JSON.parse($window.atob(userToken.split('.')[1]));
                    return user._id;
                }
            };

            // get current user's role
            token.currentUserRole = function(callback){
                if(token.isLoggedIn()){
                    var userToken = token.getToken();
                    var user = JSON.parse($window.atob(userToken.split('.')[1]));
                    $http.post('/role/id', { roleId: user.role })
                        .success(function(data) {
                            callback(data.type);
                        })
                        .error(function(error) {
                            console.log(error);
                        });
                } else {
                    callback('unassigned');
                }
            };

            //get current user's permission level
            token.currentUserPermission = function(callback) {
                if(token.isLoggedIn()) {
                    var userToken = token.getToken();
                    var user = JSON.parse($window.atob(userToken.split('.')[1]));
                    $http.post('/role/id', { roleId: user.role })
                        .success(function(data) {
                            callback(data.permission);
                        })
                }
            };

            // get current user's creator (for pupils to get their teacherid)
            token.currentUserCreator = function() {
                if(token.isLoggedIn()) {
                    var userToken = token.getToken();
                    var user = JSON.parse($window.atob(userToken.split('.')[1]));
                    return user.creator;
                }
            };

            return token;
        }
    ]);
