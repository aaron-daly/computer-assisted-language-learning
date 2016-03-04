/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('ProfileCtrl', []).controller('ProfileController', ['$scope', '$http', '$location', '$route', 'token', 'auth', 'conversationGame', 'teacher',
    function($scope, $http, $location, $route, token, auth, conversationGame, teacher) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.user = {};
        $scope.role = {};

        var conversationGames = conversationGame.scenarioListNames();

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
        $.each(conversationGames, function(key, scenarioName) {
            var btn = '<button class="btn btn-info scenario-btn" value="c">' + scenarioName +  '</button>';
            $('#scenario-container').append(btn);
        });


        //listen for scenario-btn click
        $('.scenario-btn').on('click', function() {
            if($(this).val() === 'c') {
                $location.path('/conversationGame/:' + $(this).text());
            }

            $scope.$apply();
        });


        //========================= TEACHER CONTAINER =========================

        $scope.pupils = teacher.pupils;
        $scope.selectedPupil = {};
        
        $scope.registerPupil = function() {
            var username = $scope.user.username + $scope.pupilName;
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

            $route.reload();
        };

        $scope.batchRegister = function() {
            var names = $scope.batchPupilNames.replace(' ', '').split('\n');
            $.each(names, function(key, name) {
                var username = $scope.user.username + name;
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
            });
            $route.reload();
        };

        $scope.togglePupil = function(username) {
            var i = 0;
            var length = $scope.pupils.length;

            for(i; i<length; i++) {
                if($scope.pupils[i].username === username) {
                    $scope.selectedPupil = $scope.pupils[i];
                    return;
                }
            }
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