/* global angular */
'use strict';
(function(){

	angular.module('getix').factory('UIService', [function () {
		
		var dragging = {
			on:false
		};

		var billBoard = {
			dragging:false
		};
		var bill = {
			dragging:false
		};
	
		return {
			getBill:function(){
				return bill;
			},
			setBill:function(_bill){
				console.log('bill',_bill);
				bill=_bill;
			},
			getBillBoard:function(){
				return billBoard;
			},
			setBillBoard:function(_billBoard){
				console.log('billboard',_billBoard);
				billBoard=_billBoard;
			},
			isDragging:function(pass){
				if(pass!==undefined){
					dragging.on=pass;
				}
				return dragging;
			},
			tables:{}
		};
	}]);
})();