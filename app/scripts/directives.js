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

				$scope.expand = [];

				$scope.remove = function(item){
					$scope.bill.items = _.reject($scope.bill.items,item);
				};

				//position

				$scope.$watch('bill.position',function(){
					elem.css({right:$scope.bill.position*335});
				});



				//draggers
				var lastDragDirection = '';
				$scope.dragging = UIService.isDragging();
				var maxdistance = 0;
				$scope.dragStart = function(){
					if($scope.draggable && !UIService.getBillBoard().dragging){
						maxdistance = elem.attr('maxdistance');
						elem.addClass('static');

						$scope.$parent.prepareAdjacentTo($scope.bill.position);
						UIService.isDragging(true);
						UIService.setBill({dragging:true});
					}
					
				};
				$scope.dragUp = function(e){
					if($scope.draggable && !UIService.getBillBoard().dragging){
						var distance = e.gesture.distance;
						if(distance>maxdistance){
							distance = maxdistance;
						}
						elem.css({'-webkit-transform':'translate(0,-'+distance+'px)'});
						$scope.$parent.pullWithTo(distance/3);

						lastDragDirection=e.gesture.interimDirection;
					}
				};
				$scope.dragDown=function(e){
					if($scope.draggable && !UIService.getBillBoard().dragging){
						if($scope.$parent.bills.allUp){
							var distance = e.gesture.distance;
							if(distance<0){
								distance = 0;
							}
							elem.css({'-webkit-transform':'translate(0,'+distance+'px)'});
							$scope.$parent.pullWithTo(-distance/3);

							lastDragDirection=e.gesture.interimDirection;
						}
					}
				};
				$scope.dragEnd= function(){
					if($scope.draggable && !UIService.getBillBoard().dragging){
						elem.removeClass('static');
						if(lastDragDirection==='up' && !$scope.$parent.bills.allUp){
							$scope.$parent.bills.pullAll();
						}
						else if(lastDragDirection==='down' && $scope.$parent.bills.allUp){
							$scope.$parent.bills.pushAll();
						}
						setTimeout(function(){
							elem.css({'-webkit-transform':'translate(0,0)'});
						},50);
						$scope.$parent.clearAdjacentPulls();
						UIService.isDragging(false);
						UIService.setBill({dragging:false});
					}
				};

				//pull adjacent bills
				$scope.$parent.$watch('pullBills',function(newbills,oldbills){
					if(newbills.length===0){
						//clearing pullers
						if(oldbills){
							if($scope.bill.position===oldbills[0]||$scope.bill.position===oldbills[1]){
								elem.removeClass('static');
								setTimeout(function(){
									elem.css({'webkit-transform':'translate(0,0)'});
								},100);
							}
						}
						return;
					}
					
					if(newbills){
						if($scope.bill.position===newbills[0]||$scope.bill.position===newbills[1]){
							elem.addClass('static');
						}
					}
				});
				$scope.$parent.$watch('pullWith',function(pullWith){
					if($scope.$parent.pullBills){
						if($scope.bill.position===$scope.$parent.pullBills[0]||$scope.bill.position===$scope.$parent.pullBills[1]){
							elem.css({'-webkit-transform':'translate(0,'+(-pullWith)+'px)'});
						}
					}
				});
			}
		};
	}])
	.directive('billPuller', [function () {
		return {
			restrict: 'A',
			link: function ($scope) {
				$scope.pullBills = [];
				$scope.prepareAdjacentTo = function(position){
					$scope.pullBills = [];
					for(var i=0;i<$scope.bills.opened.length;i++){
						if(($scope.bills.opened[i].position===position+1||$scope.bills.opened[i].position===position-1) && $scope.bills.opened[i].position>0){

							$scope.pullBills.push($scope.bills.opened[i].position);
						}
					}
				};
				$scope.pullWithTo =function(d){
					$scope.pullWith=d;
				};
				$scope.clearAdjacentPulls = function(){
					$scope.pullBills=[];
				};
				$scope.pullWith = 0;
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
				el.css({top:-(angular.element(window).height()-85-80)}).attr({'maxdistance':(angular.element(window).height()-85-80)});
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