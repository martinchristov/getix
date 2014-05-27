/* global angular */
'use strict';
(function(){
	angular.module('getix')
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

				$scope.billBoard = UIService.getBillBoard();

				$scope.readyToClose = function(){
					if($scope.bill.client===''&&$scope.bill.table===null){
						return true;
					}
					if($scope.bill.openedStack.items.length===0){
						return true;
					}
					return false;
				};

				//info
				$scope.tapHead = function(){
					if($scope.draggable){
						$scope.$parent.bills.pin($scope.bill);
					}
					else {
						$scope.info = !$scope.info;
					}
				};
				$scope.tables = UIService.tables;
				$scope.stalkEnter = function(e){
					if(e.keyCode===13){
						$scope.info=false;
					}
				};

				// change screen
				$scope.received=0;
				$scope.toStep2 = function(){
					if($scope.bill.items.length===0){
						$scope.$parent.bills.cancel($scope.bill);
					}
					else
					{
						$scope.received = $scope.bill.total();
						$scope.step2=true;
						setTimeout(function(){
							$('#received-input').focus();
						},600);
					}
					
				};

				//items
				$scope.expand = [];

				$scope.toggleExpand = function(index){
					if(!$scope.grouping){
						$scope.expand[index]=!$scope.expand[index];
					}
				};

				$scope.lessQuantity = function(item){
					if(item.quantity>1){
						item.quantity--;
					}
					else {
						if(item.quantity===1){
							item.quantity=0.67;
						}
						else if(item.quantity===0.67){
							item.quantity=0.5;
						}
						else if(item.quantity===0.5){
							item.quantity=0.34;
						}
					}
				};
				$scope.moreQuantity = function(item){
					if(item.quantity>=1){
						item.quantity++;
					}
					else {
						if(item.quantity===0.67){
							item.quantity=1;
						}
						else if(item.quantity===0.5){
							item.quantity=0.67;
						}
						else if(item.quantity===0.34){
							item.quantity=0.5;
						}
					}
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
					if($scope.draggable){
						maxdistance = elem.attr('maxdistance');
						elem.addClass('static');

						$scope.$parent.prepareAdjacentTo($scope.bill.position);
						// UIService.getBillBoard().dragging=true;
						// UIService.setBill({dragging:true});
					}
					
				};
				$scope.dragUp = function(e){
					if($scope.draggable){
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
					if($scope.draggable){
						if(UIService.getBillBoard().opened){
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
					if($scope.draggable){
						elem.removeClass('static');
						if(lastDragDirection==='up' && !UIService.getBillBoard().opened){
							UIService.getBillBoard().open();
						}
						else if(lastDragDirection==='down' && UIService.getBillBoard().opened){
							UIService.getBillBoard().close();
						}
						setTimeout(function(){
							elem.css({'-webkit-transform':'translate(0,0)'});
						},50);
						$scope.$parent.clearAdjacentPulls();
						// UIService.getBillBoard().dragging=false;
						// UIService.setBill({dragging:false});
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
	.directive('billTop', [function () {
		return {
			restrict: 'A',
			link: function ($scope, el) {
				function position () {
					el.css({top:-(angular.element(window).height()-55-80)}).attr({'maxdistance':(angular.element(window).height()-85-80)});
				}
				angular.element(window).resize(position);
				position();
			}
		};
	}]);
})();