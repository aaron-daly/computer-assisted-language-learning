angular.module('calliApp')
    .factory('token', ['$http', '$window', function($http, $window){
        var token = {};
        token.saveToken = function (token){
            $window.localStorage['calli-token'] = token;
        };
        token.getToken = function (){
            return $window.localStorage['calli-token'];
        };
        token.isLoggedIn = function(){
            var userToken = token.getToken();

            if(userToken){
                var payload = JSON.parse($window.atob(userToken.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        token.currentUser = function(){
            if(token.isLoggedIn()){
                var userToken = token.getToken();
                var payload = JSON.parse($window.atob(userToken.split('.')[1]));
                return payload.username;
            }
        };
        token.currentUserId = function(){
            if(token.isLoggedIn()){
                var userToken = token.getToken();
                var payload = JSON.parse($window.atob(userToken.split('.')[1]));
                return payload._id;
            }
        };
        token.currentUserRole = function(){
            if(token.isLoggedIn()){
                var userToken = token.getToken();
                var payload = JSON.parse($window.atob(userToken.split('.')[1]));
                return payload.role;
            }
        };
        return token;
    }]);
