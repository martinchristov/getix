/* global angular */
'use strict';

(function () {

	var config = function ($routeProvider, ServerProvider, localStorageServiceProvider, $sceDelegateProvider) {

		$sceDelegateProvider.resourceUrlWhitelist(['self', 'http://my.getix.net/**']);

		ServerProvider.scheme = 'http';
		ServerProvider.host = 'my.getix.net';

		localStorageServiceProvider.setPrefix('gx-');

		$routeProvider
			.when('/login', {
				controller: 'Login',
				controllerAs: 'login',
				templateUrl: 'view/login.html'
			})
			.when('/logout', {
				controller: 'Logout',
				templateUrl: 'view/login.html'
			})
			.when('/users', {
				controller: 'Users',
				templateUrl: 'view/users.html'
			})
			.when('/pos', {
				controller: 'POS',
				controllerAs: 'pos',
				templateUrl: 'view/pos.html',
				resolve: {
					appData: ['Server', '$http',
						function (Server, $http) {
							return $http.get('mock.json');
							// return Server.get('/api/v2/init');
							// return $http.get('http://dev.getix.net/api/v2/init?ApiKey=f6301dd606223f1f8aaae50fbfc7384c');
						}
					]
				}
			})
			.otherwise({
				redirectTo: '/pos'
			});
	};

	config.$inject = ['$routeProvider', 'ServerProvider', 'localStorageServiceProvider', '$sceDelegateProvider'];
	angular.module('getix').config(config);

})();