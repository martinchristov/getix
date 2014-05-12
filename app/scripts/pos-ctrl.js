/* global angular */
'use strict';

var POS = function(appData, UIService, $scope){
	this.categories = appData.data.menu.data;
	this.currentCategoryIndex = 0;
	
	this.shown = 'categories';
	this.groups = this.categories[0].groups.data;
	this.bills = null;

	this.dragging = UIService.isDragging();
};
POS.prototype.show = function(what,index){
	this.shown = what;
	if(what==='categories'){
		this.currentCategoryIndex = index;
		this.groups = this.categories[index].groups.data;
	}
};
POS.prototype.toggleBills = function(){
	if(this.shown=='bills'){
		this.shown='categories';
	}
	else {
		this.shown='bills';
		this.bills.current=-1;
	}
};

POS.$inject = ['appData','UIService', '$scope'];

angular.module('getix').controller('POS',POS);