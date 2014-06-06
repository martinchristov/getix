/* global angular,_ */
'use strict';

(function(){
	function Resource(Server, path) {
		_.extend(this, {
			_http: Server,
			_path: path
		});
	}
	/* Factory */

	Resource.$factory =  ['Server', '$q', function(Server, $q) {
		Resource.q = $q;
		return function(path) {
			return new Resource(Server, path);
		};
	}];

	/* Registration */

	angular.module('getix').factory('gxResource', Resource.$factory);

	/* Record retrieval */

	Resource.prototype.find = function(uid) {
		var deferred = Resource.q.defer();

		this._http.get(this.path(uid))
			.success(deferred.resolve)
			.error(deferred.reject);

		return deferred.promise;
	};

	Resource.prototype.path = function(uid) {
		return uid ? this._path + '/' + uid : this._path;
	};

	Resource.prototype.set = function(uid, newValue) {
		var deferred = Resource.q.defer();
		var path = this._path + '/' + uid;

		this._http
			.put(path, newValue)
			.success(deferred.resolve)
			.error(deferred.reject);

		return deferred.promise;
	};

	Resource.prototype.close = function(uid){
		var deferred = Resource.q.defer();
		var path = this._path + '/' + uid;

		this._http
			.delete(path)
			.success(deferred.resolve)
			.error(deferred.reject);

		return deferred.promise;
	};


})();