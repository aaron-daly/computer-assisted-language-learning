angular.module('calliApp')

    .factory('teacher', ['$http', 'token',
        function($http, token) {

            var teacher = {
                pupils: []
            };

            teacher.getPupils = function () {

                var _teacherId = token.currentUserId();

                $http.post('/pupils', { teacherId: _teacherId })
                    .success(function(data) {
                        angular.copy(data, teacher.pupils);
                        return data;
                    })
                    .error(function(error) {
                        console.log(error);
                    });

            };

            return teacher;
        }
    ]);
