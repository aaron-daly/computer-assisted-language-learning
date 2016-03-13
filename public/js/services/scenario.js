/**
 * Created by Dalyy on 25/02/2016.
 */
angular.module('calliApp')

    .factory('scenario', ['$http',
        function($http){

            var scenario = {};

            // create new scenario with a type and JSON of data
            scenario.create = function(scenario, callback) {
                $http.post('/scenario', scenario)
                    .success(function(data) {
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
