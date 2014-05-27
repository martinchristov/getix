/* global angular,_ */
'use strict';

var Bills = function(Bill,$timeout,$scope,UIService){
	Bills.Bill = Bill;
	Bills.$timeout=$timeout;
	Bills.UIService = UIService;

	this.$scope = $scope;
	this.current = -1;
	this.opened=[];

	this.billBoard = UIService.getBillBoard();

	// start with an open bill?
	// this.newBill();

};

Bills.prototype.addToCurrent = function(item){
	if(Bills.UIService.resizing()===false){
		if(this.current===-1){
			this.newBill();
		}
		this.opened[this.current].add(item);
		this.$scope.$broadcast('scrollbottom');
	}
	
};
Bills.prototype.newBill = function(){
	this.opened.unshift(new Bills.Bill(0));
	this.current = 0;
	//reorder items
	var _this=this;
	Bills.$timeout(function(){
		for(var i=1;i<_this.opened.length;i++){
			_this.opened[i].position++;
		}
	},100);
	
};
Bills.prototype.pin = function(bill){
	var _this=this, nextCurrent=-1;
	function setcurrent () {
		_this.current = nextCurrent;
	}
	for(var i=0;i<this.opened.length;i++){
		if(_this.opened[i]===bill){
			if(_this.current!==i || _this.billBoard.opened){
				nextCurrent=i;
				Bills.$timeout(setcurrent,100);
			}
			else {
				_this.current=-1;
			}
			// break;
		}
	}
	
	//rearrange items
	if(nextCurrent>-1){
		for(i=0;i<_this.opened.length;i++){
			if(_this.opened[i].position<_this.opened[nextCurrent].position){
				_this.opened[i].position++;
			}
		}
		_this.opened[nextCurrent].position=0;
	}

	this.boardX=0;
	Bills.$timeout(function(){
		_this.billBoard.close();
	},300);
	
};

Bills.prototype.close = function(bill){
	this.current=-1;
	var _this=this;
	Bills.$timeout(function(){
		for(var i=0;i<_this.opened.length;i++){
			if(_this.opened[i].position>bill.position){
				_this.opened[i].position--;
			}
		}
		_this.opened = _.reject(_this.opened,bill);
		bill.close();
	},400);

};
Bills.prototype.cancel = function(bill){
	this.current=-1;
	var _this=this;
	Bills.$timeout(function(){
		for(var i=0;i<_this.opened.length;i++){
			if(_this.opened[i].position>bill.position){
				_this.opened[i].position--;
			}
		}
		_this.opened = _.reject(_this.opened,bill);
	},400);
};

Bills.$inject = ['gxBill','$timeout','$scope', 'UIService'];

angular.module('getix').controller('Bills',Bills);