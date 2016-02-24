(function () {
    'use strict';

    angular.module('app')
    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$document', 'orderUtils', '$mdDialog', 'appConfig', AppCtrl]) // overall control

    function AppCtrl($scope, $rootScope, $state, $document, orderUtils, $mdDialog, appConfig) {

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;
        $scope.$watch('main', function (newVal, oldVal) {
            // if (newVal.menu !== oldVal.menu || newVal.layout !== oldVal.layout) {
            //     $rootScope.$broadcast('layout:changed');
            // }

            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.main.fixedHeader = true;
                    $scope.main.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.main.fixedHeader = false;
                    $scope.main.fixedSidebar = false;
                }
            }
            if (newVal.fixedSidebar === true) {
                $scope.main.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.main.fixedSidebar = false;
            }
        }, true);

        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            //$document.scrollTo(0, 0);
            console.log('$document.scrollTo(0, 0);' + ' threw error, uncommented for now ');
        });

        $scope.requestNewOrder = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            var pendingChanges = orderUtils.sessionHasPendingChanges();
            if (pendingChanges == true) {
                orderUtils.confirmAndSaveOrder($event, true);
            }
            else
                orderUtils.redirectToOrderRoute();// redirectToRoute('createorder');
        }

        var notifyPendingChanges = function ($event) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Order has unsaved changes')
                .textContent('The current order has unsaved chnages.  Please save or discard changes before continuing')
                .ariaLabel('Unsaved changes')
                .ok('Ok')
                .targetEvent($event)
            );
        }

    }

})();