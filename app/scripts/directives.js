/* global angular,Hammer */
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
	.directive('scrollbottom', [function () {
		return {
			restrict: 'A',
			link: function ($scope, el) {
				$scope.$on('scrollbottom', function(){
					el[0].scrollTop = el[0].scrollHeight;
					$(el).animate({scrollTop:el[0].scrollHeight},200);
				});
			}
		};
	}])

	.directive('dragBoard', [function () {
		return {
			restrict: 'A',
			link: function ($scope, el) {
				var startX= 0, quota = 0;
				var bg = angular.element('#pos');
				new Hammer(el[0]).on('dragstart', function(){
					startX = el[0].scrollLeft;
					quota = el[0].scrollWidth-el.width();
				});
				new Hammer(el[0]).on('dragleft', function(e){
					el[0].scrollLeft = startX+e.gesture.distance;
					var perc = el[0].scrollLeft/quota*100;
					bg.css({'background-position':perc+'%'});
				});
				new Hammer(el[0]).on('dragright', function(e){
					el[0].scrollLeft = startX-e.gesture.distance;
					var perc = el[0].scrollLeft/quota*100;
					bg.css({'background-position':perc+'%'});
				});
			}
		};
	}])
	.directive('dragBoardCustom', ['UIService',function (UIService) {
		return {
			restrict: 'A',
			link: function ($scope, el) {
				var xpos= 0, quota = 0;
				$scope.bills.boardX=0;
				new Hammer(el[0]).on('dragstart', function(){
					if(!UIService.getBill().dragging){
						quota = el.width()-angular.element(window).width();
						xpos = $scope.bills.boardX;
					}
				});
				new Hammer(el[0]).on('dragleft', function(e){
					$scope.$apply(function(){
						$scope.bills.boardX = xpos+e.gesture.distance;
					});
				});
				new Hammer(el[0]).on('dragright', function(e){
					$scope.$apply(function(){
						$scope.bills.boardX = xpos-e.gesture.distance;
					});
				});
				new Hammer(el[0]).on('dragend',function(){
					UIService.setBillBoard({dragging:false});
				});
			}
		};
	}])

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
					// el.height(angular.element(window).height()-attr.winHeightMinus);
					el.css({maxHeight:angular.element(window).height()-attr.winHeightMinus, height:angular.element(window).height()-attr.winHeightMinus});
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