(function () {
    'use strict';

    app.controller('fakeController', ['_', '$scope', 'fakeService', '$log', '$mdDialog', function (_, $scope, fakeService, $log, $mdDialog) {

        // begin autocomplete
        var initFakeAutocomplete = function () {
            $scope.isDisabled = false;
            $scope.searchAgencies = searchAgencies;
            $scope.onChangedAgencySelection = onChangedAgencySelection;
            $scope.selectedItem = {
                "albumId": 1,
                "id": 3,
                "title": "officia porro iure quia iusto qui ipsa ut modi",
                "url": "http://placehold.it/600/24f355",
                "thumbnailUrl": "http://placehold.it/150/1941e9"
            };
        }

        function searchAgencies(query) {

            return fakeService.getLargeRecordset(query).then(function (response) {

                var results = response.data;
                var filteredResults = _.filter(results, function (targetResults) {
                    return ~targetResults.title.toLowerCase().indexOf(query.toLowerCase());
                });
                return filteredResults;

            }, function (error) {
                console.log('ERROR!');
                return [];
            });

        }

        function onChangedAgencySelection(agency) {
            if (agency) {
                $log.info('Item changed to ' + agency.title);
            }
        }

        initFakeAutocomplete();
        // end autocomplete


        $scope.order = fakeService.order;



        // begin dialogs
        $scope.showSpotBuyline = function (ev, buylineNum) {


            if ($scope.order.SpotBuylines == null || $scope.order.SpotBuylines.length == 0)
                return;
            
            var buyline =
                _.findWhere($scope.order.SpotBuylines, { "BuylineNumber": buylineNum }); 




            var useFullScreen = false;
            
            $mdDialog.show({
                controller: spotBuylineController,
                templateUrl: '/app/partials/buylines/spotbuyline.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { buyline: buyline },
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: false,
                escapeToClose: false,
                fullscreen: useFullScreen
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
            $scope.$watch(function () {
                //return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                //$scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function spotBuylineController($scope, $mdDialog, buyline) {

            $scope.buyline = buyline;

            $scope.hide = function () {
                $log.info('new id ' + $scope.buyline.id);
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
            


        }

        //end dialogs


    }]);

})();