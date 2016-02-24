
(function () {
    'use strict';

    angular
        .module('app')
        .config(["$stateProvider", "$urlRouterProvider", "$urlMatcherFactoryProvider",
        function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $urlMatcherFactoryProvider.strictMode(false);
            $stateProvider
                .state("dashboard", { url: "/", templateUrl: "/app/views/dashboard.html", controller: "dashboardController", controllerAs: 'vm' })

                .state("orders", { url: "/orders", templateUrl: "/app/views/orders.html", controller: "ordersController" })
                .state("createorder", { url: "/createorder", templateUrl: "/app/views/create-order.html", controller: "createOrderController", controllerAs: 'vm' })

                .state("fake", { url: "/fake", templateUrl: "/app/views/fake.html", controller: "fakeController" })
                .state("otherwise", { url: '/' })
            $urlRouterProvider.otherwise('/');
        }
        ]);

})();




