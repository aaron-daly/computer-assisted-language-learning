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

            // get one scenario providing the type and name. Callback of scenario data received.
            scenario.get = function(type, name, callback) {
                $http.post('/scenario/' + type, { name: name })
                    .success(function(data){
                        callback(data);
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            };

            // get all scenarios of a particular type. Callback of scenarios' data received.
            scenario.getAll = function(type, callback) {
                $http.get('/scenario/' + type)
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
