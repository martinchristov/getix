/* global angular */
'use strict';
(function () {
	var Login = function (Account, $location) {
		this.error = null;
		this.email = '';
		this.password = '';

		this.location = $location;
		this.service = Account;
	};

	Login.prototype.submit = function () {
		this.error = null;
		this.service.login(this.email, this.password, this.loginSuccess, this.loginFail, this);
	};

	Login.prototype.loginSuccess = function (response) {
		this.service.setAccount(response.objName, response['api_key']);
		this.location.path('/users');
	};

	Login.prototype.loginFail = function (response) {
		this.error = response.message;
	};

	Login.$inject = ['Account', '$location'];

	angular.module('getix').controller('Login', Login);
})();