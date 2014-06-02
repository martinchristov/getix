/* global angular */
'use strict';
(function () {
	var Logout = function (User, $location) {
		User.unsetUser();
		$location.path('/login');
	};

	Logout.$inject = ['User', '$location'];
	angular.module('getix').controller('Logout', Logout);
})();