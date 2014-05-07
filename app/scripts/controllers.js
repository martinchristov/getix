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

	//temp code for styling
	this.newBill();
	this.currentBill = this.bills.length-1;
	this.bills[this.bills.length-1].items = [{"id":"5592","code":"","name":"Нес Кафе","fullName":"Нес Кафе","price":"1.50","childs":{"total":0},"$$hashKey":"00K","added":"2014-05-07T13:43:54.662Z","quantity":2},{"id":"5591","code":"","name":"Мляко","fullName":"Мляко","price":"1.20","childs":{"total":0},"$$hashKey":"00J","added":"2014-05-07T13:43:55.229Z","quantity":2},{"id":"5590","code":"","name":"Кафе","fullName":"Кафе","price":"1.50","childs":{"total":0},"$$hashKey":"00I","added":"2014-05-07T13:43:55.837Z","quantity":2},{"id":"5592","code":"","name":"Нес Кафе","fullName":"Нес Кафе","price":"1.50","childs":{"total":0},"$$hashKey":"00K","added":"2014-05-07T13:45:32.399Z","quantity":2},{"id":"5591","code":"","name":"Мляко","fullName":"Мляко","price":"1.20","childs":{"total":0},"$$hashKey":"00J","added":"2014-05-07T13:45:32.886Z","quantity":3},{"id":"5590","code":"","name":"Кафе","fullName":"Кафе","price":"1.50","childs":{"total":0},"$$hashKey":"00I","added":"2014-05-07T13:45:33.501Z","quantity":3},{"id":"5592","code":"","name":"Нес Кафе","fullName":"Нес Кафе","price":"1.50","childs":{"total":0},"$$hashKey":"00K","added":"2014-05-07T13:45:34.221Z","quantity":3}];
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