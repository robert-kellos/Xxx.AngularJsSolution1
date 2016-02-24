(function () {
    'use strict';
    angular.module('app')
    .factory('eorderUtils', ['_', '$mdDialog', '$state', 'toastr', eorderUtils]);

    function eorderUtils(_, $mdDialog, $state, toastr) {

        var exports = {};

        var _takeSessionSnapshot = function (eorder) {
            exports.workingOrder = eorder;
            exports.masterOrder = angular.copy(eorder);
        }

        var _clearSession = function () {
            toastr.info('Pending changes discarded', 'Discard Changes');
            exports.workingOrder = null;
            exports.masterOrder = null;
        }

        var _sessionHasPendingChanges = function () {
            //console.log('ut w' + exports.workingOrder);
            //console.log('ut m' + exports.masterOrder);

            if (exports.masterOrder && exports.workingOrder) {
                var clean = angular.equals(exports.masterOrder, exports.workingOrder);
                return (clean === false);
            }

            return false;
        }

        var _saveOrder = function () {
            // TODO: call service to save working order here
            _takeSessionSnapshot(exports.workingOrder);
            toastr.success('EOrder Saved successfully', 'Save Changes');
        }

        var _redirectToOrderRoute = function () {
            var routeName = 'createeorder';

            if ($state.$current.name === routeName)
                $state.reload();
            else
                $state.go(routeName)
        }

        var _confirmAndSaveOrder = function ($event, doRedirectAfterSave) {
            var confirm = $mdDialog.confirm()
            .title('Would you like to save your changes ?')
            .textContent('The current Order has unsaved changes...')
            .ariaLabel('Pending changes')
            .targetEvent($event)
            .ok('Save Changes')
            .cancel('Discard Changes');
            $mdDialog.show(confirm).then(function () {
                _saveOrder();
                if (doRedirectAfterSave === true) {
                    _redirectToOrderRoute();
                }
            }, function () {
                _clearSession();
                _redirectToOrderRoute();
            });
        }

        exports.workingOrder = null;
        exports.masterOrder = null;
        exports.takeSessionSnapshot = _takeSessionSnapshot;
        exports.sessionHasPendingChanges = _sessionHasPendingChanges;
        exports.clearSession = _clearSession;
        exports.saveOrder = _saveOrder;
        exports.redirectToOrderRoute = _redirectToOrderRoute;
        exports.confirmAndSaveOrder = _confirmAndSaveOrder;

        return exports;
    }

})();