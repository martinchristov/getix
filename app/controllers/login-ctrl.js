/* global angular */
'use strict';
(function () {
	var Login = function (Account, $location, $timeout) {
		this.error = null;
		this.email = '';
		this.password = '';

		this.location = $location;
		this.account = Account;
		this.timeout = $timeout;
	};

	Login.prototype.submit = function () {
		this.error = null;
		this.account.login(this.email, this.password, this.loginSuccess, this.loginFail, this);
	};

	Login.prototype.loginSuccess = function (response) {
		this.account.setAccount(response.objName, response.apiKey);
		var self = this;
		this.timeout(function(){
			self.location.path('/users');
		},200);
	};

	Login.prototype.loginFail = function (response) {
		this.error = response.message;
	};

	Login.$inject = ['Account', '$location', '$timeout'];

	angular.module('getix').controller('Login', Login);
})();