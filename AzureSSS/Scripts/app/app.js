angular.module('TestApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider.
         when('/home', {
             templateUrl: '/scripts/app/components/Quiz/QuizPage.html',
             controller: 'quizController'
         }).
         when('/firstPage', {
             templateUrl: '/scripts/app/components/pageOne/pageOne.html',
             controller: 'firstController'
         }).
         when('/secondPage', {
             templateUrl: '/scripts/app/components/pageTwo/pageTwo.html',
             controller: 'secondController'
         })
    })
