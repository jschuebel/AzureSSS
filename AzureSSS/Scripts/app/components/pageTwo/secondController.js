angular.module('TestApp')
    .controller('secondController', function ($scope, $http, $interval) {
    $scope.MobileNumber = "123456";
    $scope.EmailID = "anu@test.com";
    $scope.title = "title nottin yet";
    $scope.messages = [];
    $scope.intervalPromise = undefined;


    $scope.testmethod = function(parm1) {
        console.log("testmethod called param1 coming next");
        console.log(parm1);
        $scope.messages.push(parm1);
    }

    $scope.hero = {
        name: 'Spawn'
    };

    
    $scope.sendText = function () {

        $scope.title = "started sendText";

        $scope.intervalPromise = $interval(
        function () {
            var promise = $http.get('/api/message/count');
            promise.then(onNotificationSuccess, onNotificationFailed);
        }, 1000);

        //        var msg = JSON.stringify({ msg: $scope.MobileNumber });
        var msg = { msgT: $scope.MobileNumber };

        $http.put("/api/message", msg).then(function (data, status, headers, config) {
        }), function (data, status, headers, config) {
            $scope.title = "Oops... something went wrong";
            $scope.working = false;
        };
    };
    
    function updateMessageList () {
        
        //MobileNumber
        $http.get("/api/message", { params: { msgText: $scope.MobileNumber } }).then(function (data, status, headers, config) {
            console.log(data.data);
            $scope.messages = [];
            data.data.messages.forEach(function (item) {
                $scope.messages.push(item);
            });
        }), function (data, status, headers, config) {
            $scope.title = "Oops... something went wrong";
            $scope.working = false;
        };
    };
    function onNotificationSuccess(response) {
        // alert("in success");
//        if (response != null && response.data != null && response.data.length > 0)
        if (response != null) {
            if ($scope.messages.length !== response.data) {
                console.log("calling updateMessageList $scope.messages.length=", $scope.messages.length, "response.data=", response.data);
                if (angular.isDefined($scope.intervalPromise)) {
                    $interval.cancel($scope.intervalPromise);
                    $scope.intervalPromise = undefined;
                }
                $scope.title = "Got it... displaying messages";
                updateMessageList();
            }
        }
        return response.data;
    }

    function onNotificationFailed(response) {
        alert("in Failure");
        throw response.data || 'An error occurred while attempting to process request';
    }

    $scope.initialize = function () {
        $scope.$on('$destroy', function () {
            if (angular.isDefined($scope.intervalPromise)) {
                $interval.cancel($scope.intervalPromise);
                $scope.intervalPromise = undefined;
            }
        });

    };

        $scope.initialize();
    })
