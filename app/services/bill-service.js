
'use strict';

(function(){
	var BILLS_STORE = '_bills';

	var Service = function(Server, localStorageService, $q, $http){
		this.server = Server;
		this.store = localStorageService;
		this.q = $q;
		this.http = $http; //remove this
	};

	Service.prototype.getBills = function(){
		var deferred = this.q.defer(),
			self = this;

		if(this.store.get(BILLS_STORE)) {
			this.timeout(function(){
				deferred.resolve(self.store.get(BILLS_STORE));
			});
		}
		else {
			this.fetchBills().success(function(d){
				deferred.resolve(d);
			});
		}
		return deferred.promise;
	};

	Service.prototype.fetchBills = function(){
		// var promise = this.server.get('/api/v2/init'),
		var promise = this.http.get('bills.json'),
			self = this;
		promise.success(function(data){
			self.store.set(BILLS_STORE, data);
		});
		return promise;
	};
})();