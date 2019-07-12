angular.module('TestApp')
    .controller('firstController', function ($scope, $http) {
        $scope.FirstName = "Anubhav";
        $scope.LastName = "Chaudhary";
        $scope.messages = [];
        $scope.holdst = 0;
        $scope.vstart = 0;
        $scope.loading = false;

        angular.element(document.querySelector('#divGrd')).bind('scroll', function () {
            $scope.holdst = $(this).scrollTop();
            if ($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - 1)) {
                if (!$scope.loading) {
                    $scope.loading = true;
                    loadNewContent(); //call function to load content when scroll reachs DIV bottom                
                }
            }
        });


        angular.element(document.querySelector('#divGrd2')).bind('scroll', function () {
            $scope.holdst = $(this).scrollTop();

            var ih2 = $(this).innerHeight();
            var sh2 = $(this)[0].scrollHeight;

            var cb2 = $scope.holdst + ih2;



            if ($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - 1)) {
                if (!$scope.loading) {
                    $scope.loading = true;
                    loadNewContent(); //call function to load content when scroll reachs DIV bottom                
                }
            }
        });


        loadNewContent();
        //        for (var i = 0; i < $scope.vstart; i++)
        //                $scope.messages.push({ Name: 'test' + i, addr: ('10' + i + ' addr'), salary: 112000+(i*1000) });


        function loadNewContent() {
            var endcnt = $scope.vstart + 3;
            $.ajax({
                type: 'GET',
                url: '/api/message/lazy2?vstart=' + $scope.vstart + '&vstop=' + endcnt,
                success: function (data) {
                    if (data != "") {
                        $scope.loading = false;
                        var obj = JSON.parse(data);
                        $scope.UpdateGrid(obj);
                        $("#divGrd").scrollTop($scope.holdst);
                        $scope.vstart += 3;

                        var holdwidths = [];
                        var newTbl = $("#tblHeader");
                        var oTbl = $("#tblData");
                        // save original width
                        oTbl.attr("data-item-original-width", oTbl.width());
                        oTbl.find('tbody tr:eq(0) td').each(function () {
                            holdwidths.push($(this).width());
                        });

                        // replace ORIGINAL COLUMN width                
                        newTbl.width(oTbl.attr('data-item-original-width'));
                        newTbl.find('tr th').each(function (index, el) {
                            $(this).width(holdwidths[index]);
                        });

                    }
                }
            });
        }

        $(window).on('resize', function () {

            var holdwidths = [];
            var newTbl = $("#tblHeader");
            var oTbl = $("#tblData");
            // save original width
            oTbl.attr("data-item-original-width", oTbl.width());
            oTbl.find('tbody tr:eq(0) td').each(function () {
                holdwidths.push($(this).width());
            });

            // replace ORIGINAL COLUMN width                
            newTbl.width(oTbl.attr('data-item-original-width'));
            newTbl.find('tr th').each(function (index, el) {
                $(this).width(holdwidths[index]);
            });
        });

        function MyNum() {
            var max = 100, min = 0;
            var _val = (Math.floor(Math.random() * (max - min + 1)) + min);
            console.log("initial val", _val);

            this.divideBy = function (divider) {
                _val = (_val / divider);
                console.log("divided by divider", divider, "result", _val);
                return this;
            };
            this.multiplyBy = function (multi) {
                _val = (_val * multi);
                console.log("multiplyBy by multi", multi, "result", _val);
                return this;
            };
            this.add = function (add) {
                _val = (_val + add);
                return this;
            };
            this.subtract = function (sub) {
                _val = (_val - sub);
                return this;
            };

            this.result = function () {
                return _val;
            };
        }

        function padL(a, maxlen, c) {//string/number,length=2,char=0
            //"James Schuebel           "
            var b = maxlen - a.length;
            var na = new Array((b || 1) + 1);
            var naj = (a || '') + na.join(c || 0);
            //var nas = naj.slice((b || 2));
            return ((a || '') + new Array((b || 1) + 1).join(c || 0));
        }


        $scope.testfont = function () {

            /*
            var tests = "Favorite Food > Pizza Type";
            var fnt = $('#selFmt').css('font-family');
            var sz = lazyload.getTextWidth(tests, fnt);
            var asz = sz / tests.length;
            */

            /** only runs on edge not ie11 */
            doWork()
                .then(doWork)
                .then(doError)
                .then(doWork) // this will be skipped
                //.then(doWork, errorHandler) //dowork will be skipped
                .catch(errorHandler)
                .then(doWork)
                .then(function (data) { return verify('anonymous function in testfont; pass message from "then"') });


            /** only runs on edge not ie11
             Promise example chain vs linked
            var promise = new Promise(function (resolve, reject) {
                resolve("first test");
            });

            promise.then(function(val) {
                console.log("first then:", val); // 1
                return val + "-added1";
            }).then(function(val) {
                console.log("chained then:", val); // 3
            });

            promise.then(function (val) {
                console.log("linked then:", val); // 3
            });
             */

            // #########################################################

            //example chaining:
            var test = (new MyNum()).divideBy(2).add(5).multiplyBy(3).subtract(10);
            console.log("test result", test.result());


            var res = padL('James Schuebel', 25, 'X');
            console.log("pad result", res);

            $.ajax({
                type: 'GET',
                url: '/api/message/fmtsel',
                success: function (data) {
                    if (data != "") {
                        $("#selFmt").html(data);
                    }
                }
            });




        }


        $scope.UpdateGrid = function (parm1) {
            console.log("UpdateGrid called param1 coming next");
            console.log(parm1);
            for (var x = 0; x < parm1.length; x++)
                $scope.messages.push(parm1[x]);
            /*                var len = $scope.messages.length;
                            for (var x = 0; x < len + 3; x++)
                                $scope.messages.push({ Name: 'test' + x, addr: ('10' + x + ' addr'), salary: 112000 + (x * 1000) });
            */
            $scope.$apply();
        }


    })
