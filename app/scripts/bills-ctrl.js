/* global angular,_ */
'use strict';

var Bills = function(Bill){
	Bills.Bill = Bill;

	this.current = -1;
	this.opened=[];
};

Bills.prototype.addToCurrent = function(item){
	if(this.current===-1){
		this.newBill();
	}
	this.opened[this.current].add(item);
};
Bills.prototype.newBill = function(){
	this.opened.push(new Bills.Bill());
	this.current = this.opened.length-1;
};
Bills.prototype.close = function(bill){
	this.opened = _.reject(this.opened,bill);
};
Bills.prototype.cancel = function(bill){
	this.opened = _.reject(this.opened,bill);
};

Bills.$inject = ['gxBill'];

angular.module('getix').controller('Bills',Bills);