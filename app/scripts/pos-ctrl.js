/* global angular */
'use strict';

var POS = function(appData){
	this.categories = appData.data.menu.data;
	this.currentCategoryIndex = 0;
	
	this.shown = 'categories';
	this.groups = this.categories[0].groups.data;
};
POS.prototype.show = function(what,index){
	this.shown = what;
	if(what==='categories'){
		this.currentCategoryIndex = index;
		this.groups = this.categories[index].groups.data;
	}
};

POS.$inject = ['appData'];

angular.module('getix').controller('POS',POS);