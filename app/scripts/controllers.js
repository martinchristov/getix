/* global angular */
'use strict';

var POS = function($scope, appData, Bill){
	POS.Bill = Bill;

	this.categories = appData.data.menu.data;
	this.currentCategoryIndex = 0;
	
	this.shown = 'categories';
	this.groups = this.categories[0].groups.data;

	this.currentBill = -1;
	this.bills=[];
};
POS.prototype.show = function(what,index){
	this.shown = what;
	if(what==='categories'){
		this.currentCategoryIndex = index;
		this.groups = this.categories[index].groups.data;
	}
};

POS.prototype.addToBill = function(item){
	if(this.currentBill===-1){
		this.newBill();
	}
	this.bills[this.currentBill].add(item);
};
POS.prototype.newBill = function(){
	this.bills.push(new POS.Bill());
	this.currentBill = this.bills.length-1;
};

POS.$inject = ['$scope','appData', 'gxBill'];

angular.module('getix').controller('POS',POS);