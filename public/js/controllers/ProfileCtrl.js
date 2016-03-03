/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('ProfileCtrl', []).controller('ProfileController', ['$scope', '$http', '$location', 'token', 'auth', 'game',
    function($scope, $http, $location, token, auth, game) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });
        $scope.preview = function() {
            $location.path('/preview');
        };

        $scope.user = {};
        $scope.role = {};

        var scenarios = game.scenarioListNames();

        //get current user
        $http.post('/user', { username: token.currentUser() })
            .then(function(data) {

                $scope.user = data.data;
                var roleId = $scope.user.role;

                //with user's role id, get current user's role
                $http.post('/role/id', { roleId:roleId })
                    .then(function(data) {
                        $scope.role = data.data;
                    })

            });

        //append buttons for scenarios to play
        $.each(scenarios, function(key, scenarioName) {
            var btn = '<button class="btn btn-info scenario-btn">' + scenarioName +  '</button>';
            $('#scenario-container').append(btn);
        });


        //listen for scenario-btn click
        $('.scenario-btn').on('click', function() {
            $location.path('/game/:' + $(this).text());
            $scope.$apply();
        });


        //========================= TEACHER CONTAINER =========================

        $scope.pupils = [];

        $scope.registerPupil = function() {

            var username = $scope.user.username + $scope.pupilName;
            console.log('register pupil ' + username);

            auth.register({
                username: username,
                password: $scope.user.username,
                role: 'student',
                creator: $scope.user._id
            }, function(error) {
                if(error) {
                    displayError(error);
                }
                else {
                    displayMessage('Pupil successfully added.');
                }
            });

            $scope.pupils.push({
                'name': $scope.pupilName
            });
        };

        function displayError(error) {
            console.log(error);
        }
        function displayMessage(message) {
            console.log(message);
        }

        // ======================= END TEACHER CONTAINER ======================
    }
]);