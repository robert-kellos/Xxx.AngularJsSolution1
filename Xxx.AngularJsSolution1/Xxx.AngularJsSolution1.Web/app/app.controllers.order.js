'use strict';
angular
    .module('app')
    .controller('ordersController', ['$scope', 'ordersService', function ($scope, ordersService) {

    var updatePagingInfo = function (pagingData) {
        $scope.pagingInfo.totalItems = parseInt(pagingData.TotalCount);

        if ($scope.pagingInfo.page == 0)
            $scope.pagingInfo.page = 1;

        $scope.pagingInfo.showPager = ($scope.orders && $scope.orders.length > 0);

        //setSordIndicator(pagingData.sortField, pagingData.reverse);
    };

    var getPagingParams = function () {
        var pagingInfo = $scope.pagingInfo;
        return {
            "page": pagingInfo.page,
            "pageSize": pagingInfo.itemsPerPage,
            "sortBy": pagingInfo.sortBy,
            "reverse" : pagingInfo.reverse
        };
    }

    var getActiveOrders = function () {
        var args = getPagingParams();
        ordersService.getActiveOrders(args).then(function (results) {
            $scope.orders = results.data;
            updatePagingInfo(angular.fromJson(results.headers("app-data-pagination")));
        }, function (error) {
            //alert(error.data.message);
        });
    }

    $scope.selectPage = function (page) {
        $scope.pagingInfo.page = page;
        getActiveOrders();
    };

    $scope.sort = function (sortBy) {
        if (sortBy === $scope.pagingInfo.sortBy) {
            $scope.pagingInfo.reverse = !$scope.pagingInfo.reverse;
        } else {
            $scope.pagingInfo.sortBy = sortBy;
            $scope.pagingInfo.reverse = false;
        }
        $scope.pagingInfo.page = 1;
        getActiveOrders();
    };

    $scope.orders = [];

    $scope.pagingInfo = {
        page: 1,
        itemsPerPage: 15,
        totalItems: 0,
        sortBy: 'id',
        reverse: true,
        showPager: false
    };

    getActiveOrders();

}]);