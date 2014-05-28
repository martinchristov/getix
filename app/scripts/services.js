/* global angular */
'use strict';
(function(){

	angular.module('getix').factory('UIService', [function () {
		
		var dragging = {
			on:false
		};

		var billBoard = {
			dragging:false,
			opened:false,
			billDragging:false,
			open:function(){
				billBoard.opened = true;
			},
			close:function(){
				billBoard.opened = false;
				console.log(billBoard);
			}
		};
		var bill = {
			dragging:false
		};

		var resizing=false;
	
		return {
			getBill:function(){
				return bill;
			},
			setBill:function(_bill){
				bill=_bill;
			},
			getBillBoard:function(){
				return billBoard;
			},
			setBillBoard:function(_billBoard){
				console.log('billboard',_billBoard);
				// billBoard=_billBoard;
			},
			isDragging:function(pass){
				if(pass!==undefined){
					dragging.on=pass;
				}
				return dragging;
			},
			resizing: function(){
				return resizing;
			},
			setResizing:function(to){
				resizing=to;
			},
			tables:{}
		};
	}]);
})();