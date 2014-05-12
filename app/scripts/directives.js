/* global angular,_ */
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

	.directive('bill', ['UIService',function (UIService) {
		return {
			restrict: 'E',
			replace: true,
			transclude:true,
			templateUrl:'directives/bill.html',
			scope:{
				bill:'='
			},
			link: function ($scope, elem, attrs) {
				$scope.received=0;
				$scope.toStep2 = function(){
					$scope.received = $scope.bill.total();
					$scope.step2=true;
					// angular.element(document.getElementById('received-input')).focus();
					setTimeout(function(){
						$('#received-input').focus();
					},600);
				};
				$scope.remove = function(item,bill){
					bill.items = _.reject(bill.items,item);
				};
				//draggers
				if(attrs.draggable=='true'){
					$scope.dragging = UIService.isDragging();
					console.log($scope.dragging);
					$scope.dragStart = function(){
						angular.element(elem).css({'-webkit-transition':'none'});
						UIService.isDragging(true);
					};
					$scope.dragUp = function(e){
						angular.element(elem).css({'-webkit-transform':'translate(0,-'+e.gesture.distance+'px)'})
					};
					$scope.dragDown=function(){

					};
					$scope.dragEnd= function(){
						angular.element(elem).removeAttr('style');
						UIService.isDragging(false);
					};
				}
			}
		};
	}])

	.directive('billdrag', function () {
	    return {
	        link: function(elem, $scope, attrs){
	            console.log('here');
				
	        }
	    };
	})

	.directive('currency', function () {
	    return {
	        require: 'ngModel',
	        link: function(elem, $scope, attrs, ngModel){
	            ngModel.$formatters.push(function(val){
	                return val.toFixed(2);
	            });
	            // ngModel.$parsers.push(function(val){
	            //     return val.replace(/^\$/, '')
	            // });
	        }
	    };
	})

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