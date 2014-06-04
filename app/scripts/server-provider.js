/* global angular */
'use strict';

(function () {
	var Server = function () {
		this.scheme = 'http';
		this.host = '';
		// this.adapter;
		this.token = null;

		this.$get = [
			'$http',
			function ($http) {
				if (undefined === this.adapter) {
					this.adapter = $http;
				}
				return this;
			}
		];
	};

	var schemeRegex = /^(?:(https|http)\:\/{1,3})/i;
	Server.prototype.genURL = function (url) {
		return schemeRegex.test(url) ? url : this.buildUrl(url);
	};

	Server.prototype.setAdapter = function (adapter) {
		this.adapter = adapter;
		return this;
	};

	Server.prototype.setToken = function (token) {
		this.token = token;
		return this;
	};

	Server.prototype.buildUrl = function (path) {
		path = path.replace(/^\/+/, ''); // remove start path slashes
		return this.scheme + '://' + this.host + '/' + path;
	};


	Server.prototype.get = function (url, data, callback, context) {
		return this.request(url, data, callback, context, 'get');
	};

	Server.prototype.post = function (url, data, callback, context) {
		return this.request(url, data, callback, context, 'post');
	};

	Server.prototype.put = function (url, data, callback, context) {
		return this.request(url, data, callback, context, 'put');
	};

	Server.prototype['delete'] = function (url, data, callback, context) {
		return this.request(url, data, callback, context, 'delete');
	};

	Server.prototype.request = function (url, data, callback, context, method) {
		var request,
			headers = {};

		method = method || 'get';
		context = context || null;
		url = this.genURL(url);
		

		if (typeof url !== 'string') {
			throw new Error('[API Connect]: Invalid or missing URL!\n');
		}


		// Allow data arg to be optional
		if (typeof data === 'function') {
			context = callback;
			callback = data;
			data = {};
		}

		if (this.token){
			headers.token = this.token;
		}

		request = {
			method: method,
			url: url,
			data: data,
			headers: headers
		};
		
		return this.adapter(request)
			.success(function (response) {
				if(callback!==undefined){
					return callback.call(context, response);
				}
			})
			.error(function (response) {
				if (status === 404){
					throw new Error('404: Not found');
				}
				if (status === 403) {
					throw new Error('403: Forbidden');
				}
				if (status === 500) {
					throw new Error('500: Server error');
				}
				if(callback){
					return callback.call(context, response);
				}
			});
	};

	// Server.$inject=['http'];

	angular.module('getix').provider('Server', Server);
})();