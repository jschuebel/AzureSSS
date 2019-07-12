angular.module('TestApp')
    .controller('quizController', function ($scope, $http, $location) {
        $scope.answered = false;
        $scope.title = "loading question...";
        $scope.options = [];
        $scope.correctAnswer = false;
        $scope.working = false;



        $scope.answer = function () {
            return $scope.correctAnswer ? 'correct' : 'incorrect';
        };

        $scope.nextQuestion = function () {

            console.log("init nextQuestion call");
            $scope.working = true;
            $scope.answered = false;
            $scope.title = "loading question...";
            $scope.options = [];

            $http.get("/api/trivia").then(function (data, status, headers, config) {
                $scope.options = data.data.options;
                $scope.title = data.data.title;
                $scope.answered = false;
                $scope.working = false;
            }), function (data, status, headers, config) {
                $scope.title = "Oops... something went wrong";
                $scope.working = false;
            };
        };

        $scope.sendAnswer = function (option) {
            $scope.working = true;
            $scope.answered = true;

            $http.post('/api/trivia', { 'questionId': option.questionId, 'optionId': option.id }).then(function (data, status, headers, config) {
                $scope.correctAnswer = (Boolean(data.data) === true);
                $scope.working = false;
            }), function (data, status, headers, config) {
                $scope.title = "Oops... something went wrong";
                $scope.working = false;
            };
        };

    });