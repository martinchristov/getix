/* global angular */
'use strict';

angular.module('getix')
	.directive('group', [function () {
		return {
			restrict: 'E',
			replace: true,
			templateUrl:'directives/group.html',
			scope:{
				group:'='
			},
			link: function ($scope) {
				console.log($scope.group);
			}
		};
	}])

	.directive('bill', [function () {
		return {
			restrict: 'E',
			replace: true,
			transclude:true,
			templateUrl:'directives/bill.html',
			scope:{
				bill:'='
			},
			link: function () {
				
			}
		};
	}]);