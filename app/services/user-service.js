/* global angular */
'use strict';

(function () {

	var USER_STORE = '_user';
	var USERID_STORE = '_userid';

	var User = function (Server, localStorageService) {
		this.server = Server;
		this.store = localStorageService;

		this.server.setUserId(this.getUserId());
	};

	User.prototype.login = function (user) {
		this.store.set(USER_STORE, user.name);
		this.store.set(USERID_STORE, user.id);
		this.server.setUserId(this.getUserId());
		return this;
	};

	User.prototype.logout = function () {
		this.store.remove(USER_STORE);
		this.store.remove(USERID_STORE);
		return this;
	};

	User.prototype.getUser = function () {
		return this.store.get(USER_STORE);
	};

	User.prototype.getUserId = function () {
		return this.store.get(USERID_STORE);
	};

	User.$inject = ['Server', 'localStorageService'];
	angular.module('getix').service('User', User);
})();