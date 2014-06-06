/* global angular,_ */
'use strict';

var Bills = function (Bill, $timeout, $scope, UIService, $q) {
	this.Bill = Bill;
	this.timeout = $timeout;
	this.UIService = UIService;
	this.q = $q;

	this.$scope = $scope;
	this.current = -1;
	this.opened = [];

	this.billBoard = UIService.getBillBoard();

	var self = this;
	$scope.$on('collapseBill',function(){
		self.current = -1;
	});


	//the idPointer should be: {connectedUserIndex}*10,000
	//leaving it static for now
	this.idPointer = 10000;
};

Bills.prototype.addToCurrent = function (item) {
	if (this.UIService.resizing() === false) {
		if (this.current === -1) {
			this.newBill();
		}
		this.opened[this.current].add(item);
		this.$scope.$broadcast('scrollbottom');
	}

};
Bills.prototype.newBill = function () {
	var deferred = this.q.defer(),
		self=this;
	
	this.opened.unshift(new this.Bill(deferred.promise));
	this.timeout(function(){
		deferred.resolve({id:self.generateId()});
	});

	this.current = 0;
	//reorder items
	var _this = this;
	this.timeout(function () {
		for (var i = 1; i < _this.opened.length; i++) {
			_this.opened[i].position++;
		}
	}, 100);

};
Bills.prototype.pin = function (bill) {
	var _this = this,
		nextCurrent = -1;

	function setcurrent() {
		_this.current = nextCurrent;
	}
	for (var i = 0; i < this.opened.length; i++) {
		if (_this.opened[i] === bill) {
			if (_this.current !== i || _this.billBoard.opened) {
				nextCurrent = i;
				this.timeout(setcurrent, 100);
			} else {
				_this.current = -1;
			}
			// break;
		}
	}

	//rearrange items
	if (nextCurrent > -1) {
		for (i = 0; i < _this.opened.length; i++) {
			if (_this.opened[i].position < _this.opened[nextCurrent].position) {
				_this.opened[i].position++;
			}
		}
		_this.opened[nextCurrent].position = 0;
	}

	this.boardX = 0;
	this.timeout(function () {
		_this.billBoard.close();
	}, 300);

};

Bills.prototype.close = function (bill) {
	this.current = -1;
	var self = this;
	this.timeout(function () {
		for (var i = 0; i < self.opened.length; i++) {
			if (self.opened[i].position > bill.position) {
				self.opened[i].position--;
			}
		}
		self.opened = _.reject(self.opened, bill);
		bill.close();
	}, 400);

};
Bills.prototype.cancel = function (bill) {
	this.current = -1;
	var self = this;
	this.timeout(function () {
		for (var i = 0; i < self.opened.length; i++) {
			if (self.opened[i].position > bill.position) {
				self.opened[i].position--;
			}
		}
		self.opened = _.reject(self.opened, bill);
	}, 400);
};

Bills.prototype.generateId = function(){
	this.idPointer++;
	return this.idPointer;
};

Bills.$inject = ['gxBill', '$timeout', '$scope', 'UIService', '$q'];

angular.module('getix').controller('Bills', Bills);