/* global angular */
'use strict';

(function () {

	var login = function ($root, $location, User) {
		var checkLogin = function (event) {
			if (!User.isAuthenticated() && '/login' !== $location.path()) {
				event.preventDefault();
				window.location.href='#/login';
				return ;
			}
		};

		$root.$on('$locationChangeStart', checkLogin);
	};


	login.$inject = ['$rootScope', '$location', 'User'];
	angular.module('getix').run(login);
})();