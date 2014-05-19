/* global angular */
'use strict';

angular.module('getix', [
		'ngRoute',
		'hmTouchEvents',
		'ngAnimate',
		'fx.animations'
	]).config(['$routeProvider',function ($routeProvider) {
		$routeProvider
			.when('/login', {controller:'Login', templateUrl:'view/login.html'})
			.when('/users', {controller:'Users', templateUrl:'view/users.html'})
			.when('/pos', {
				controller:'POS',
				controllerAs:'pos',
				templateUrl:'view/pos.html',
				resolve:{
					appData:['$http',function($http){
						return $http.get('mock.json');
						// return $http.get('http://dev.getix.net/api/v2/init?ApiKey=f6301dd606223f1f8aaae50fbfc7384c');
					}]
				}
			})
			.otherwise({ redirectTo: '/pos' });
	}]
);

//fix for ios elastic scroll
document.addEventListener(
'touchmove',
function(e) {
e.preventDefault();
},
false
);