/* global angular */
'use strict';

var POS = function($scope, appData, Bill){
	POS.Bill = Bill;

	this.products = appData.data.menu.data;
	this.currentProductIndex = 0;
	this.billsOn=false;
	this.shown = 'products';
	this.groups = this.products[0].groups.data;

	this.currentBill = -1;
	this.bills=[];
};
POS.prototype.show = function(what,index){
	this.shown = what;
	if(what==='products'){
		this.currentProductIndex = index;
		this.groups = this.products[index].groups.data;
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