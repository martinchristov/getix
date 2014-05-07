/* global angular */
'use strict';

var POS = function($scope, appData){
	this.products = appData.data.menu.data;
	this.billsOn=false;
	this.shown = 'products';
	this.groups = this.products[0].groups.data;
	console.log(appData.data);
};
POS.prototype.show = function(what,index){
	this.shown = what;
	if(what==='products'){
		this.groups = this.products[index].groups.data;
		console.log(this.groups);
	}
};
POS.$inject = ['$scope','appData'];

angular.module('getix').controller('POS',POS);