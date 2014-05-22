/* global angular,_ */
'use strict';
(function(){

	function Bill(position){
		this.index=0;
		this.position=position;
		this.items = [];
		this.table = null;
		this.client = '';

		this.closedStack = null;
		this.openedStack=null;
		this.newStack();
	}
	Bill.$factory = [
		function(){
			return Bill;
		}
	];

	angular.module('getix').factory('gxBill', Bill.$factory);

	Bill.prototype.add = function(item){
		//add to the last item?
		if(this.openedStack.items.length>0){
			if(this.openedStack.items[this.openedStack.items.length-1].id===item.id){
				this.openedStack.items[this.openedStack.items.length-1].quantity++;
				return;
			}
		}
		//add a new item
		var index = this.index++;
		this.openedStack.items.push(
			_.extend(_.clone(item),{
				index:index,
				quantity:1
			})
		);
	};
	Bill.prototype.remove = function(item){
		this.openedStack.items = _.reject(this.openedStack.items,item);
	};

	Bill.prototype.newStack = function(){
		this.openedStack = {
			items:[]
		};
	};
	Bill.prototype.closeStack = function(){
		var _this=this,
			idDict={};

		var stack = _.extend(_.clone(_this.openedStack),{
			total: 0
		});

		for(var i=0;i<stack.items.length;i++){
			stack.total+= stack.items[i].quantity*stack.items[i].price;

			if(!idDict.hasOwnProperty(stack.items[i].id)){
				idDict[stack.items[i].id] = i;
			}
			else {
				stack.items[idDict[stack.items[i].id]].quantity+=stack.items[i].quantity;
				stack.items.splice(i,1);
				i--;
			}
		}

		if(this.closedStack!==null){
			idDict = {};
			for(i=0;i<this.closedStack.items.length;i++){
				idDict[this.closedStack.items[i].id]=i;
			}
			for(i=0;i<stack.items.length;i++){
				if(idDict.hasOwnProperty(stack.items[i].id)){
					this.closedStack.items[idDict[stack.items[i].id]].quantity+=stack.items[i].quantity;
				}
				else {
					this.closedStack.items.push(stack.items[i]);
				}
				this.closedStack.total+=stack.items[i].quantity*stack.items[i].price;
			}
		}
		else {
			this.closedStack = stack;
		}

		

		this.newStack();
	};

	Bill.prototype.setTable = function(table){
		if(this.table!==null){
			this.table.busy=false;
		}
		this.table = table;
		table.busy=true;
	};

	Bill.prototype.close = function(){
		if(this.table!==null){
			this.table.busy=false;
		}
	};

	Bill.prototype.cancel = function(){

	};

	Bill.prototype.total = function(){
		var total=0;
		if(this.closedStack!==null){
			total+=this.closedStack.total;
		}
		for(var i=0;i<this.openedStack.items.length;i++){
			total+=this.openedStack.items[i].price*this.openedStack.items[i].quantity;
		}
		return total;
	};

})();
