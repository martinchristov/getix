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
				controllerAs: 'users',
				templateUrl: 'view/users.html'
			})
			.when('/pos', {
				controller: 'POS',
				controllerAs: 'pos',
				templateUrl: 'view/pos.html',
				resolve: {
					appData: ['Server', '$http', 'Init',
						function (Server, $http, Init) {
							// return $http.get('mock.json');
							return Init.getData();
						}
					]
				}
			})
			.when('/dashboard',{
				controller:'Dash',
				controllerAs:'dash',
				templateUrl:'view/dashboard.html'
			})
			.otherwise({
				redirectTo: '/pos'
			});
	};

	config.$inject = ['$routeProvider', 'ServerProvider', 'localStorageServiceProvider', '$sceDelegateProvider'];
	angular.module('getix').config(config);

})();