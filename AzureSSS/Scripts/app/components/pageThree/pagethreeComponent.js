angular.module('TestApp').component('heroDetail', {
    templateUrl: '/scripts/app/components/pageThree/heroDetail.html',
    bindings: {
        hero: '<',
        calbak: '&'
    },
    controller: function () {
        var self = this;
        self.mynewvalue = "next alien";
        this.$onInit = function () {
            console.log("init of hero");
            console.log(self.hero);
        };

    }
});