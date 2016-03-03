angular.module('calliApp')

    .factory('teacher', ['$http', 'auth',
        function($http, auth) {

            var teacher = {
                pupils: []
            };

            teacher.getPupils = function() {

                // if current user is a teacher...
                if(auth.authorize('teacher')) {

                    var _teacherId = token.currentUserId();

                    $http.post('/pupils', { teacherId: _teacherId })
                        .success(function(data) {
                            console.log(data);
                        })
                        .error(function(error) {
                            console.log(error);
                        });

                }
                else {
                    console.log('You do not have permission');
                }
            };

            return teacher;
        }
    ]);
