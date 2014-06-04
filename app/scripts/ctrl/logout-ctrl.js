/* global angular */
'use strict';
(function () {
	var Logout = function (Account, $location) {
		Account.unsetAccount();
		$location.path('/login');
	};

	Logout.$inject = ['Account', '$location'];
	angular.module('getix').controller('Logout', Logout);
})();