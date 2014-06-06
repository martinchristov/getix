/* global angular */
'use strict';

(function(){
	var config = {
		restrict:'E',
		templateUrl:'directives/topbar.html'
	};
	function TopBar () {
		// body...
	};

	config.link = TopBar;

	angular.module('getix').directive('topBar',[function(){
		return config;
	}])
})();