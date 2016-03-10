/**
 * Created by Dalyy on 25/02/2016.
 */
angular.module('calliApp')

    .factory('scenario', ['$http',
        function($http){

            var scenario = {};

            // create new scenario with a type and JSON of data
            scenario.create = function(type, cS) {
                $http.post('/scenario/' + type + '/add', cS)
                    .success(function(data) {
                        console.log(data);
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            };

            scenario.getAll = function(callback) {

            };

            // get all conversation scenarios, callback list
            scenario.getConversationScenarios = function(callback) {
                $http.get('/conversationScenarios')
                    .success(function(data){
                        callback(data);
                    })
                    .error(function(error) {
                       console.log(error);
                    });
            };

            // get picture scenarios, callback list
            scenario.getPictureScenarios = function(callback) {
                $http.get('/pictureScenarios')
                    .success(function(data){
                        callback(data);
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            };
            scenario.getPictureScenarios = function(callback) {
                $http.get('/pictureScenarios')
                    .success(function(data){
                        callback(data);
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            };
            scenario.getWordScenarios = function(callback) {
                $http.get('/wordScenarios')
                    .success(function(data){
                        callback(data);
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            };

            // get all word scenarios, callback list
            scenario.getWordScenarios = function(callback) {
                $http.get('/wordScenarios')
                    .success(function(data){
                        callback(data);
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            };
            scenario.getScenarios = function(callback) {
                $http.get('/Scenarios')
                    .success(function(data){
                        callback(data);
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            };

            // get all word scenarios, callback list
            scenario.getScenarios = function(callback) {
                $http.get('/scenarios')
                    .success(function(data){
                        callback(data);
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            };


            return scenario;
        }
    ]);
