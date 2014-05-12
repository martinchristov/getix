/* global angular,_ */
'use strict';

var Bills = function(Bill,$timeout){
	Bills.Bill = Bill;
	Bills.$timeout=$timeout;

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
	this.opened.unshift(new Bills.Bill());
	this.current = 0;
};
Bills.prototype.close = function(bill){
	this.current=-1;
	var _this=this;
	Bills.$timeout(function(){
		_this.opened = _.reject(_this.opened,bill);
	},300);
	
};
Bills.prototype.cancel = function(bill){
	this.current=-1;
	var _this=this;
	Bills.$timeout(function(){
		_this.opened = _.reject(_this.opened,bill);
	},300);
};

Bills.$inject = ['gxBill','$timeout'];

angular.module('getix').controller('Bills',Bills);