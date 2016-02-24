(function () {
    'use strict';
    angular
        .module('app')
        .controller('dashboardController', dashboardCtlr);

    dashboardCtlr.$inject = ['$scope', '$log'];

    function dashboardCtlr($scope, $log) {

        /* jshint validthis: true */
        var vm = this;

        vm.dashboard = {
            totalOrders: 120,
            submittedOrders: 76,
            pendingOrders: 44,
            totalRevenue: "445.8K"
        };
    }

})();