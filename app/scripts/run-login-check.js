/* global angular */
'use strict';

(function () {

	var login = function ($root, $location, Account) {
		var checkLogin = function () {
			if (!Account.isAuthenticated() && '/login' !== $location.path()) {
				// event.preventDefault();
				// window.location.href='#/login';
				// return ;
				// $location.path('/login');
			}
		};

		$root.$on('$locationChangeStart', checkLogin);
	};


	login.$inject = ['$rootScope', '$location', 'Account'];
	angular.module('getix').run(login);
})();