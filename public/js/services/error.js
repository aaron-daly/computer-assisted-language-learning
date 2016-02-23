/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('calliApp')
    .factory('error', ['$http', function($http){
        var error = {
            loginError: '',
            registerError: ''
        };

        error.setLoginError = function(err) {
            console.log('new login error: ' + err);
            this.loginError = err;
        };

        error.getLoginError = function() {
            var err = this.loginError;
            this.loginError = '';
            return err;
        };

        return error;
    }]);