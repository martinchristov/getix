/* global angular */
'use strict';

(function () {

	var NAME_STORE = '_account';
	var KEY_STORE = '_key';

	var Account = function (Server, localStorageService, Init) {
		this.server = Server;
		this.store = localStorageService;
		this.init = Init;
		Server.setToken(this.getApiKey());
	};

	Account.prototype.login = function (email, password, success, fail, context) {
		var data = {
			email: email,
			password: password
		};
		success.call(context, {}, 200);
		// var self = this;
		// self.server.setToken('asdasdasd')
		// this.server.post('/api/v2/login/', data, function (response, status) {
		// 	if (response.error) {
		// 		return fail.call(context, response, status);
		// 	} else {
		// 		self.server.setToken(response.apiKey);
		// 		return success.call(context, response, status);
		// 	}
		// });
	};

	Account.prototype.setAccount = function (name, key) {
		console.log(name,key);
		this.store.set(NAME_STORE, name);
		this.store.set(KEY_STORE, key);
		return this;
	};

	Account.prototype.unsetAccount = function () {
		this.store.remove(NAME_STORE);
		this.store.remove(KEY_STORE);
		this.init.clearData();
		return this;
	};

	Account.prototype.getName = function () {
		return this.store.get(NAME_STORE);
	};

	Account.prototype.getApiKey = function () {
		return this.store.get(KEY_STORE);
	};

	Account.prototype.isAuthenticated = function () {
		// return true;
		return this.getName() ? true : false;
	};

	Account.$inject = ['Server', 'localStorageService', 'Init'];
	angular.module('getix').service('Account', Account);
})();