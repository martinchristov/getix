/* global angular */
'use strict';
(function () {
	var Login = function (User, $location) {
		this.error = null;
		this.email = '';
		this.password = '';

		this.location = $location;
		this.service = User;
	};

	Login.prototype.submit = function () {
		this.error = null;
		this.service.login(this.email, this.password, this.loginSuccess, this.loginFail, this);
	};

	Login.prototype.loginSuccess = function (response) {
		this.service.setUser(response.objName, response['api_key']);
		this.location.path('/pos');
	};

	Login.prototype.loginFail = function (response) {
		this.error = response.message;
	};

	Login.$inject = ['User', '$location'];

	angular.module('getix').controller('Login', Login);
})();