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
			link: function () {
				
			}
		};
	}])

	.directive('bill', ['$timeout',function ($timeout) {
		return {
			restrict: 'E',
			replace: true,
			transclude:true,
			templateUrl:'directives/bill.html',
			scope:{
				bill:'='
			},
			link: function ($scope) {
				$scope.remove = function(item,bill,event){
					
					bill.items = _.reject(bill.items,item);
					// bill.items.splice(2,1);
				}
			}
		};
	}])

	.directive('winHeightMinus', [function () {
		return {
			restrict: 'A',
			link: function ($scope, el, attr) {
				angular.element(window).resize(function(){
					el.height(angular.element(window).height()-attr.winHeightMinus);
				})
				.resize();
			}
		};
	}])
	.directive('animateOnChange', ['$animate',function($animate) {
		return function(scope, elem, attr) {
			scope.$watch(attr.animateOnChange, function(nv,ov) {
				if (nv!==ov) {
					var c = nv > ov ? 'change-up':'change';
					$animate.addClass(elem,c, function() {
						$animate.removeClass(elem,c);
					});
				}
			});
		};
	}])
	;