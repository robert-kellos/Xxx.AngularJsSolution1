(function () {
    'use strict';
    angular
        .module('app')
        .controller('createOrderController', createOrderCtrl);

    createOrderCtrl.$inject = ['_', '$location', '$state', '$scope', '$filter', 'ordersService', 'orderUtils', '$timeout', '$q', '$log', '$mdDialog'];

    function createOrderCtrl(_, $location, $state, $scope, $filter, ordersService, orderUtils, $timeout, $q, $log, $mdDialog) {

        /* jshint validthis: true */
        var vm = this;

        /* begin bindable members */
        vm.dialogs = {
            agencyChooser: null,
            advertiserChooser: null,
            aeChooser: null,
            productChooser: null,
            spotBuylineEditor: null,
            interactiveBuylineEditor: null,
            nonAirtimeBuylineEditor: null,
            options: {
                generic: { width: 550, height: 400, actions: ["Maximize", "Close"], modal: true },
                agency: { width: 550, height: 400, actions: ["Maximize", "Close"], modal: true, title: 'Find Agency' },
                advertiser: { width: 550, height: 400, actions: ["Maximize", "Close"], modal: true, title: 'Find Advertiser' },
                accountExecutive: { width: 550, height: 400, actions: ["Maximize", "Close"], modal: true, title: 'Find Account Executive' },
                product: { width: 550, height: 400, actions: ["Maximize", "Close"], modal: true, title: 'Find Products' },
                spotBuyline: { width: 550, height: 400, actions: ["Maximize", "Close"], modal: true, title: 'Spot Buyline' },
                interactiveBuyline: { width: 550, height: 400, actions: ["Maximize", "Close"], modal: true, title: 'Interactive Buyline' },
                nonAirtimeBuyline: { width: 550, height: 400, actions: ["Maximize", "Close"], modal: true, title: 'Non-Airtime Buyline' }
            }
        };

        vm.formatName = function (ae) {
            return formatFullname(null, ae.PersonFirstName, ae.PersonLastName, ae.PersonMiddleName, null, false);
        }

        vm.initNewOrder = function ($event) {

            $log.info('------');
            $log.info(vm.workingOrder);
            $log.info('------');

            $event.preventDefault();
            $event.stopPropagation();

            // TODO:
            // check to see if current order is dirty, 
            // prompt user to save changes before redirecting

            if ($state.$current.name === 'createorder') {
                $state.reload();
            } else {
                $state.go('createorder')
            }
        }

        vm.isVisibleOrder = false;

        vm.isVisibleInitOrder = false;

        vm.newOrderConfig = {
            selectedSeller: null,
            selectedStation: null,
            startDate: null,
            endDate: null,
            spotBuylines: null,
            interactiveBuyines: null,
            nonAirtimeBuylines: null,
            maxBuylineCount: 10,
            isVisible: true
        }

        vm.onBlurAgencyInput = function ($event) {
            if (vm.searchInputs.agency.toLowerCase() === vm.agency.Office.OfficeName.toLowerCase())
                return;

            vm.onClickSearchAgencies($event);
        }

        vm.onChangedProductSelection = function (product) {
            if (vm.workingOrder) {
                vm.workingOrder.Product = product;
                console.log('product set to ' + product);
            }
        }

        vm.onChangedAccountExecutiveSelection = function (ae) {
            if (vm.workingOrder && vm.workingOrder.Seller) {
                vm.workingOrder.Seller.Contacts = [];
                vm.workingOrder.Seller.Contacts.push(ae);
                refreshAeInfo(ae);
                console.log('ae set to ' + ae);

            }
        }

        vm.onChangedAdvertiserSelection = function (advertiser) {

            if (vm.workingOrder) {
                vm.workingOrder.Advertiser = advertiser;
                refreshAdvertiserInfo(advertiser);
                console.log('advertiser set to ' + advertiser);
            }
        }

        vm.onChangedAgencySelection = function (agency) {
            if (vm.workingOrder) {
                vm.workingOrder.Agency = agency;
                refreshAgencyInfo(agency);
                console.log('agency set to ' + agency);
            }
        }

        vm.onChangedSellerSelection = function (seller) {

            // when the seller changes find and 
            // attach the corresponding station 
            // using the station name or 
            // some other mechanism

            if (vm.newOrderConfig) {
                vm.newOrderConfig.selectedSeller = seller;

                console.log('seller set to ' + seller);
                if (seller) {
                    var query = seller.Value.CompanyName;
                    var segments = query.split("-");

                    if (segments && segments.length > 0)
                        query = segments[0]

                    ordersService.findStation(query).then(function (response) {
                        var station = response.data;
                        vm.newOrderConfig.selectedStation = station;
                    }, function (error) {
                        $log.info('error finding station');
                    });
                }
            }
        }

        vm.onClickAddSpotBuyline = function (e) {
            vm.openLookupDialog(vm.dialogs.spotBuylineEditor, vm.dialogs.options.spotBuyline);
        }

        vm.onClickEditSpotBuyline = function (e) {
            vm.openLookupDialog(vm.dialogs.spotBuylineEditor, vm.dialogs.options.spotBuyline);
        }

        vm.onClickRemoveSpotBuyline = function (e) {
            alert('put remove logic here');
        }

        vm.onClickSaveOrder = function ($event) {
            if (orderUtils.sessionHasPendingChanges() === true) {
                orderUtils.saveOrder();
            }
        }

        vm.onClickSearchAgencies = function ($event) {
            var searchVal = vm.searchInputs.agency;
            if (searchVal.length === 0)
                return;

            vm.showAgencySearchResults($event);     //shows the result dropdown
            var agencies = ordersService.testAgencies;  // replace here with call to web api 
            if (agencies) {

                // for now, filter the data in the UI, replace with service layer filtering
                var filteredAgencies = _.filter(agencies, function (targetAgencies) {
                    return ~targetAgencies.Office.OfficeName.toLowerCase().indexOf(vm.searchInputs.agency.toLowerCase());
                });

                agencies = null;

                vm.searchResults.agencies = filteredAgencies;
                vm.searchResults.agencyCount = filteredAgencies.length;
            }
        }

        vm.onSubmitInitOrder = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            ordersService.getNewOrder().then(function (results) {

                takeOrderSnapshot(results.data);

                // copy values from pre config to working order
                vm.workingOrder.StartDate = vm.newOrderConfig.startDate;
                vm.workingOrder.EndDate = vm.newOrderConfig.endDate;
                vm.workingOrder.Seller = vm.newOrderConfig.selectedSeller;
                vm.workingOrder.Station = vm.newOrderConfig.selectedStation;

                $scope.$broadcast("OrderChanged", results.data);

                // hide pre-config screen (automatically shows the order data entry inputs)
                vm.newOrderConfig.isVisible = false;
                // TODO: Save the Pre-config to local storage for future perhaps

            }, function (error) {
                alert(error); // replace here with a dilaoged message
            });
        }

        vm.openOrder = function (ev) {
            alert('open');
        }

        vm.openLookupDialog = function (win, options) {
            win.setOptions(options);
            win.center();
            win.open();
        }

        vm.orderModel = ordersService.testOrder;

        vm.searchAccountExecutives = function (query) {
            return ordersService.findAccountExecutives(query).then(function (response) {
                var results = response.data;
                var filteredResults = _.filter(results, function (targetResults) {
                    return ~targetResults.PersonLastName.toLowerCase().indexOf(query.toLowerCase());
                });

                if (filteredResults.length === 1) {
                    vm.onChangedAccountExecutiveSelection(filteredResults[0]);
                    hideAutocomplete('aeLookup');
                }
                return filteredResults;

            }, function (error) {
                console.log('error retrieving account executives');
                return [];
            });
        }

        vm.searchAdvertisers = function (query) {
            return ordersService.findAdvertisers(query).then(function (response) {
                var results = response.data;
                var filteredResults = _.filter(results, function (targetResults) {
                    return ~targetResults.CompanyName.toLowerCase().indexOf(query.toLowerCase());
                });

                if (filteredResults.length === 1) {
                    vm.onChangedAdvertiserSelection(filteredResults[0]);
                    hideAutocomplete('advertiserLookup');
                }

                return filteredResults;

            }, function (error) {
                console.log('error retrieving advertisers');
                return [];
            });
        }

        vm.searchAgencies = function (query) {
            return ordersService.findAgencies(query).then(function (response) {
                var results = response.data;
                var filteredResults = _.filter(results, function (targetResults) {
                    return ~targetResults.CompanyName.toLowerCase().indexOf(query.toLowerCase());
                });

                if (filteredResults.length === 1) {
                    vm.onChangedAgencySelection(filteredResults[0]);
                    hideAutocomplete('agencyLookup');
                }
                return filteredResults;

            }, function (error) {
                console.log('error retrieving agencies');
                return [];
            });
        }

        vm.searchConfig = {
            isOpenAgencySearchResults: false,
            isOpenAdvertiserSearchResults: false
        }

        vm.searchInputs = {
            advertisers: '',
            agencies: ''
        }

        vm.searchOrders = function (ev) {
            alert('search');
        }

        vm.searchProducts = function (query) {
            return ordersService.findProducts(query).then(function (response) {
                var results = response.data;
                var filteredResults = _.filter(results, function (targetResults) {
                    return ~targetResults.ProductName.toLowerCase().indexOf(query.toLowerCase());
                });

                if (filteredResults.length === 1) {
                    vm.onChangedProductSelection(filteredResults[0]);
                    hideAutocomplete('productLookup');
                }

                return filteredResults;

            }, function (error) {
                console.log('error retrieving products');
                return [];
            });
        }

        vm.searchResults = {
            advertisers: [],
            advertiserCount: 0,
            agencies: [],
            agencyCount: 0
        }

        vm.searchSellers = function (query) {
            return ordersService.findSellers(query).then(function (response) {
                var results = response.data;
                var filteredResults = _.filter(results, function (targetResults) {
                    return ~targetResults.Value.CompanyName.toLowerCase().indexOf(query.toLowerCase());
                });
                if (filteredResults.length === 1) {
                    vm.onChangedSellerSelection(filteredResults[0]);
                    hideAutocomplete('stationLookup');
                }
                return filteredResults;

            }, function (error) {
                console.log('error retrieving sellers');
                return [];
            });
        }

        vm.showAgencySearchResults = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.searchConfig.isOpenAgencySearchResults = true;
        }

        vm.toolbarConfig = {
            isOpen: true,
            count: 0,
            selectedDirection: 'left'
        };

        /* end bindable members */


        /* begin helper methods */
        var formatAddress = function (address) {
            var _address = '';

            if (address.Street1 && address.Street1.length != 0 && address.Street1 != ".")
                _address += address.Street1;

            if (address.Street2 && address.Street2.length != 0 && address.Street2 != ".")
                _address += " " + address.Street2;

            if (address.Street3 && address.Street3.length != 0 && address.Street3 != ".")
                _address += " " + address.Street3;

            if (address.City && address.City.length != 0 && address.City != ".")
                _address += " " + address.City;

            if (address.RegionCode && address.RegionCode.length != 0 && address.RegionCode != ".")
                _address += " " + address.RegionCode;

            if (address.PostalCode && address.PostalCode.length != 0 && address.PostalCode != ".")
                _address += " " + address.PostalCode;

            if (address.CountryCode && address.CountryCode.length != 0 && address.CountryCode != ".")
                _address += " " + address.CountryCode;

            return _address;

        }

        var formatContactInfo = function (prefix, firstName, lastName, middleName, suffix, firstInitialOnly, phone, email) {
            var _name = formatFullname(prefix, firstName, lastName, middleName, suffix, firstInitialOnly);
            var _phone = '', _email = '';

            if (phone && phone.length > 0) {
                var targetPhone = phone[0];
                if (targetPhone)
                    _phone += targetPhone.CountryAccessCode + ' ' + targetPhone.AreaCityCode + ' ' + targetPhone.PhoneNumber + ' (' + targetPhone.phoneLocation + ')';
            }
            if (email && email.length > 0)
                _email = email[0];

            return _name + ' ' + _email + ' ' + _phone;
        }

        var formatDate = function (dt) {
            return (dt.getMonth() + 1) +
            "/" + dt.getDate() +
            "/" + dt.getFullYear();
        }

        var formatFullname = function (prefix, firstName, lastName, middleName, suffix, firstInitialOnly) {
            var fName = firstName == null ? "" : firstInitialOnly ? (firstName.substring(0, 1) + ".") : firstName;
            var lName = lastName == null ? "" : " " + lastName;
            var sffx = suffix == null ? "" : suffix;
            var prfx = prefix == null ? "" : prefix;
            var mName = middleName == null ? "" : " " + middleName.substring(0, 1) + ". ";

            if (fName == '' && lName == '')
                return '';
            else if (lName.length == 0 && fName.length > 0)
                return fName;
            else if (fName.length == 0 && lName.length > 0)
                return lName;
            else {
                sffx = (sffx == '') ? "" : " " + sffx;
                prfx = (prfx == '') ? "" : prfx + " ";
                return prfx + fName + mName + lName + sffx;
            }
        }

        var getWorkingOrderPrimaryAe = function () {
            var ae = null;
            var order = vm.workingOrder;
            if (order) {
                var contacts = order.Seller.Value.Contacts;
                var aes = $filter('filter')(contacts, { "ContactRole": 'AccountExec' }, true);
                if (aes.length) {
                    ae = aes[0];
                }
            }

            return ae;
        }

        var hideAutocomplete = function (ctl) {
            setTimeout(function () {
                var child = document.getElementById(ctl).firstElementChild;
                var el = angular.element(child);
                el.scope().$mdAutocompleteCtrl.hidden = true;
            }, 100);


        }

        var isWorkingOrderModified = function () {

            console.log('master : ' + vm.masterOrder);
            console.log('working : ' + vm.workingOrder);

            if (vm.masterOrder && vm.workingOrder) {
                var clean = angular.equals(vm.masterOrder, vm.workingOrder);
                return clean === false;
            }

            return false;
        }

        var newOrderController = function ($scope, $mdDialog) {

            vm.hide = function () {
                $mdDialog.hide();
            };
            vm.cancel = function () {
                $mdDialog.cancel();
            };
            vm.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }

        var refreshAeInfo = function (ae) {
            vm.primaryAeFullName = '';
            vm.primaryAeContactDetails = ''
            vm.primaryAe = ae;

            if (ae != null) {
                vm.primaryAeFullName = formatFullname(null, ae.PersonFirstName, ae.PersonLastName, ae.PersonMiddleName, null, false);
                vm.primaryAeContactDetails = formatContactInfo(ae.PersonPrefix, ae.PersonFirstName, ae.PersonLastName, ae.PersonMiddleName, null, false, ae.Phone, ae.Email);
            }
        }

        var refreshAdvertiserInfo = function (advertiser) {
            vm.advertiserAddress = '';
            if (advertiser && advertiser.Addresses) {
                var addresses = advertiser.Addresses;
                var businessAddresses = $filter('filter')(addresses, { AddressRole: 'Business' }, true);
                if (businessAddresses && businessAddresses.length > 0) {
                    var businessAddress = businessAddresses[0];
                    vm.advertiserAddress = formatAddress(businessAddress);
                }
            }
        }

        var refreshAgencyInfo = function (agency) {
            vm.agencyAddress = '';

            if (agency && agency.Addresses) {
                var addresses = agency.Addresses;
                var businessAddresses = $filter('filter')(addresses, { AddressRole: 'Business' }, true);
                if (businessAddresses && businessAddresses.length > 0) {
                    var businessAddress = businessAddresses[0];
                    vm.agencyAddress = formatAddress(businessAddress);
                }
            }
        }

        var setFlightDates = function () {
            vm.startDate = '';
            vm.endDate = ''

            if (vm.orderModel.StartDate && vm.orderModel.StartDate.length > 0) {
                var sd = new Date(vm.orderModel.StartDate);
                vm.startDate = formatDate(sd);
                vm.minEndDate = vm.startDate;
            }

            if (vm.orderModel.EndDate && vm.orderModel.EndDate.length > 0) {
                var ed = new Date(vm.orderModel.EndDate);
                vm.endDate = formatDate(ed);
                vm.maxStartDate = vm.endDate;
            }
        }

        var setLstCashTradeTypes = function () {
            vm.lstCashTradeOptions = {
                optionLabel: "",
                dataTextField: 'value',
                dataValueField: 'value',
                dataSource: { data: ordersService.lstCashTrade }
            };
        }

        var setLstOrderTypes = function () {
            vm.lstOrderTypeOptions = {
                optionLabel: "",
                dataTextField: 'value',
                dataValueField: 'value',
                dataSource: { data: ordersService.lstOrderTypes }
            };
        }

        var setLstBusinessTypes = function () {
            vm.lstBusinessTypeOptions = {
                optionLabel: "",
                dataTextField: 'value',
                dataValueField: 'value',
                dataSource: { data: ordersService.lstBusinessTypes }
            };
        }

        var setBuylineGridOptions = function () {
            var buttonConfiguration = {
                addSpotBuyline: '<md-button aria-label="New Spot Buyline" class="md-fab md-primary md-fab-xs" ng-click="onClickAddSpotBuyline()"><md-tooltip md-direction="bottom">Add Spot Buyline</md-tooltip><i class="fa fa-plus"></i></span></md-button>',
                addInteractiveBuyline: '<md-button aria-label="New Interactive Buyline" class="md-fab md-primary md-fab-xs" ng-click="onClickAddInteractiveBuyline()"><md-tooltip md-direction="bottom">Add Interactive Buyline</md-tooltip><i class="fa fa-plus"></i></span></md-button>',
                addNonAirtimeBuyline: '<md-button aria-label="New Non-airtime Buyline" class="md-fab md-primary md-fab-xs" ng-click="onClickAddNonAitimeBuyline()"><md-tooltip md-direction="bottom">Add Non-Airtime Buyline</md-tooltip><i class="fa fa-plus"></i></span></md-button>',

                editSpotBuyline: '<md-button aria-label="Edit Buyline" class="md-fab md-accent md-fab-xs" ng-click="onClickEditSpotBuyline()"><md-tooltip md-direction="bottom">Edit Buyline</md-tooltip><i class="fa fa-pencil"></i></span></md-button>',
                editInteractiveBuyline: '<md-button aria-label="Edit Buyline" class="md-fab md-accent md-fab-xs" ng-click="onClickEditInteractiveBuyline()"><md-tooltip md-direction="bottom">Edit Buyline</md-tooltip><i class="fa fa-pencil"></i></span></md-button>',
                editNonAirtimeBuyline: '<md-button aria-label="Edit Buyline" class="md-fab md-accent md-fab-xs" ng-click="onClickEditNonAirtimeBuyline()"><md-tooltip md-direction="bottom">Edit Buyline</md-tooltip><i class="fa fa-pencil"></i></span></md-button>',

                removeSpotBuyline: '<md-button aria-label="Remove Buyline" class="md-fab md-warn md-fab-xs" ng-click="onClickRemoveSpotBuyline()"><md-tooltip md-direction="bottom">Remove Buyline</md-tooltip><i class="fa fa-remove"></i></span></md-button>',
                removeInteractiveBuyline: '<md-button aria-label="Remove Buyline" class="md-fab md-warn md-fab-xs" ng-click="onClickRemoveInteractiveBuyline()"><md-tooltip md-direction="bottom">Remove Buyline</md-tooltip><i class="fa fa-remove"></i></span></md-button>',
                removeNonAirtimeBuyline: '<md-button aria-label="Remove Buyline" class="md-fab md-warn md-fab-xs" ng-click="onClickRemoveNonAirtimeBuyline()"><md-tooltip md-direction="bottom">Remove Buyline</md-tooltip><i class="fa fa-remove"></i></span></md-button>'
            }

            // spot-buyline grids
            vm.spotBuylinesGridOptions = {
                dataSource: new kendo.data.DataSource({
                    data: vm.orderModel.SpotBuylines
                }),
                name: "spotBuylineGrid",
                sortable: true,
                pageable: false,
                selectable: false,
                toolbar: [{ template: buttonConfiguration.addSpotBuyline }],
                columns: [
                  { command: [{ text: "", width: "80px", template: buttonConfiguration.editSpotBuyline }], width: 50 },
                  { field: "BuylineNumber", title: "ID", width: 90 },
                  { field: "StartDate", title: "FBD", width: 100, format: "{0:MM/dd/yyyy}" },
                  { field: "EndDate", title: "LBD", width: 100, format: "{0:MM/dd/yyyy}" },
                  { field: "BuylineDescription", title: "Time Class" },
                  { field: "BuylineQuantity.Value", title: "Spots", width: 200 },
                  { field: "BuylineUnitRate.Value", title: "Rate", width: 200 },
                  { field: "BuylineGrossAmount", title: "Total" },
                  { command: [{ text: "", width: "80px", template: buttonConfiguration.removeSpotBuyline }], width: 50 },
                ]
            };

            // interactive-buyline grids
            vm.interactiveBuylinesGridOptions = {
                dataSource: new kendo.data.DataSource({
                    data: vm.orderModel.InteractiveBuylines
                }),
                sortable: true,
                pageable: false,
                columns: [
                  { field: "BuylineNumber", title: "ID", width: 50 },
                  { field: "StartDate", title: "FBD", width: 100, format: "{0:MM/dd/yyyy}" },
                  { field: "EndDate", title: "LBD", width: 100, format: "{0:MM/dd/yyyy}" },
                  { field: "BuylineDescription", title: "Time Class", width: 150 },
                  { field: "BuylineQuantity.Value", title: "Spots", width: 80 },
                  { field: "BuylineUnitRate.Value", title: "Rate", width: 80 },
                  { field: "BuylineGrossAmount", title: "Total" }
                ]
            };

            // non-airtime-buyline grids
            vm.nonAirtimeBuylinesGridOptions = {
                dataSource: new kendo.data.DataSource({
                    data: vm.orderModel.NonAirtimeBuylines
                }),
                sortable: true,
                pageable: false,
                columns: [
                  { field: "BuylineDescription", title: "Description" },
                  { field: "UnitCost", title: "Unit Cost", width: 100 },
                  { field: "NonAirtimeGrossAmount", title: "Total", width: 100 }
                ]
            };
        }

        var takeOrderSnapshot = function (order) {
            orderUtils.takeSessionSnapshot(order)
            vm.workingOrder = orderUtils.workingOrder;
            vm.masterOrder = orderUtils.masterOrder;
        }

        /* end helper methods */


        /* begin explicit $scope methods */
        $scope.$on("OrderChanged", function (order) {


            refreshAeInfo(getWorkingOrderPrimaryAe());
            refreshAdvertiserInfo(vm.workingOrder.Advertiser);
            refreshAgencyInfo(vm.workingOrder.Agency);

        });

        $scope.$watch('vm.newOrderConfig.spotBuylines', function (newValue, oldValue) {
            if (oldValue != null && newValue == undefined)
                vm.newOrderConfig.spotBuylines = oldValue;
            //console.log('ov : ' + oldValue + ' nv ' + newValue);
        });

        $scope.$watch('startDate', function (newValue, oldValue) {
            vm.orderModel.StartDate = newValue;
        });

        $scope.$watch('endDate', function (newValue, oldValue) {
            vm.orderModel.EndDate = newValue;
        });
        /* end explicit $scope methods */


        /* begin controller initializers */
        //setFlightDates();
        //setAdvertiser();
        //setAgency();
        //setPrimaryAe();
        setLstCashTradeTypes();
        setLstOrderTypes();
        setLstBusinessTypes();
        setBuylineGridOptions();
        /* end controller initializers */

    }

})();
