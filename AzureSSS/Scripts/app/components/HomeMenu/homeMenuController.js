angular.module('TestApp').component('homeMenu', {
    templateUrl: '/scripts/app/components/HomeMenu/menu.html',
    bindings: {},
    controller: function ($location) {
        var self = this;
        self.myactive = true;
        self.calcnt = 0;

        self.isActive = function (path, tst) {
            var usedpath = $location.url();
            var hadMatch = (usedpath.substr(0, tst.length) === path) ? true : false;
           // console.log(self.calcnt++, usedpath, path, tst, hadMatch);
            return hadMatch;
        }
        this.$onInit = function () {
            console.log("init of menu");
        };

    }
});