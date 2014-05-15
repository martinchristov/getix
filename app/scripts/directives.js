/* global angular,_,Hammer */
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
				bill:'=',
				draggable:'='
			},
			link: function ($scope, elem) {

				//info
				$scope.tables = UIService.tables;
				$scope.setTable = function(table){
					$scope.bill.table = table;
					table.busy=true;
					// $scope.infotab=2;
				};

				// change screen
				$scope.received=0;
				$scope.toStep2 = function(){
					$scope.received = $scope.bill.total();
					$scope.step2=true;
					setTimeout(function(){
						$('#received-input').focus();
					},600);
				};

				//items

				$scope.remove = function(item,bill){
					bill.items = _.reject(bill.items,item);
				};

				$scope.$watch('bill.position',function(){
					angular.element(elem).css({right:$scope.bill.position*335});
				});



				//draggers
				$scope.dragging = UIService.isDragging();
				var maxdistance = 0;
				$scope.dragStart = function(){
					if($scope.draggable){
						maxdistance = elem.attr('maxdistance');
						angular.element(elem).addClass('static');
						UIService.isDragging(true);
					}
					
				};
				$scope.dragUp = function(e){
					if($scope.draggable){
						var distance = e.gesture.distance;
						if(distance>maxdistance){
							distance = maxdistance;
						}
						angular.element(elem).css({'-webkit-transform':'translate(0,-'+distance+'px)'});
					}
				};
				$scope.dragDown=function(){

				};
				$scope.dragEnd= function(){
					if($scope.draggable){
						angular.element(elem).removeClass('static');
						setTimeout(function(){
							angular.element(elem).css({'-webkit-transform':'translate(0,0)'});
						},50);
						UIService.isDragging(false);
					}
				};
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
	.directive('billTop', [function () {
		return {
			restrict: 'A',
			link: function ($scope, el) {
				angular.element(el).css({top:-(angular.element(window).height()-85-80)}).attr({'maxdistance':(angular.element(window).height()-85-80)});
			}
		};
	}])

	.directive('dragBoard', [function () {
		return {
			restrict: 'A',
			link: function ($scope, el) {
				var startX= 0;
				Hammer(el[0]).on('dragstart', function(){
					startX = el[0].scrollLeft;
				});
				Hammer(el[0]).on('dragleft', function(e){
					el[0].scrollLeft = startX+e.gesture.distance;
				});
				Hammer(el[0]).on('dragright', function(e){
					el[0].scrollLeft = startX-e.gesture.distance;
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