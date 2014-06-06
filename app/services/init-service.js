/* global angular */
'use strict';

(function () {

	var NAME_STORE = '_init';

	var Init = function(Server, localStorageService, $q, $timeout){
		this.server = Server;
		this.store = localStorageService;
		this.q = $q;
		this.timeout = $timeout;
	};

	Init.prototype.getData = function(){
		var deferred = this.q.defer(),
			self = this;
		if(this.store.get(NAME_STORE)) {
			this.timeout(function(){
				deferred.resolve(self.store.get(NAME_STORE));
			});
		}
		else {
			this.fetchData().success(function(d){
				deferred.resolve(d);
			});
		}
		return deferred.promise;
	};

	Init.prototype.clearData = function(){
		this.store.remove(NAME_STORE);
	};

	Init.prototype.fetchData = function(){
		var promise = this.server.get('/api/v2/init'),
			self = this;
		promise.success(function(data){
			self.store.set(NAME_STORE, data);
		});
		return promise;
	};

	Init.prototype.getUsers = function(){
		var deferred = this.q.defer(),
			self = this;
		if(this.store.get(NAME_STORE)){
			this.timeout(function(){
				deferred.resolve(self.store.get(NAME_STORE).operators.data);
			},50);
		}
		else {
			this.fetchData().success(function(d){
				deferred.resolve(d.operators.data);
			});
		}
		return deferred.promise;
	};

	Init.$inject = ['Server', 'localStorageService', '$q', '$timeout'];
	angular.module('getix').service('Init', Init);
})();