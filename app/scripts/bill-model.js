/* global angular,_ */
'use strict';
(function(){

	function Bill(futureBillData){
		_.extend(this,{
			index:0,
			position:0,
			table:null,
			client:'',
			closedStack:null,
			openedStack:null,
			lastGroupItem : {price:0}
		});

		this.$unwrap(futureBillData);
		this.newStack();
	}
	Bill.$factory = [
		'$timeout',
		// '$resource',
		function($timeout, $resource){
			_.extend(Bill,{
				$timeout:$timeout,
				$$resource:$resource
			});
			return Bill;
		}
	];

	angular.module('getix').factory('gxBill', Bill.$factory);

	Bill.prototype.$unwrap = function(futureBillData){
		var self = this;

		this.$futureBillData = futureBillData;
		this.$futureBillData.then(function(data) {
			Bill.$timeout(function() { _.extend(self, data); });
		});
	};

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

		this.$save();
	};
	Bill.prototype.remove = function(item){
		this.openedStack.items = _.reject(this.openedStack.items,item);

		this.$save();
	};

	Bill.prototype.group = function(){
		var groupItem = {
			items:[],
			price:0,
			quantity:1,
			type:'group'
		},
			_this = this;

		for (var i = this.openedStack.items.length - 1; i >= 0; i--) {
			if(_this.openedStack.items[i].checked){
				groupItem.price+=_this.openedStack.items[i].price*_this.openedStack.items[i].quantity;
				groupItem.items.push(_this.openedStack.items[i]);
				_this.openedStack.items.splice(i,1);
			}
		}
		if(groupItem.items.length>0){
			groupItem.name = 'Mix '+ groupItem.items[groupItem.items.length-1].name;
			groupItem.index=this.index++;
			this.openedStack.items.push(groupItem);
			this.lastGroupItem = groupItem;
		}
	};

	Bill.prototype.newStack = function(){
		this.openedStack = {
			items:[]
		};

		this.$save();
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
		if(table!==null){
			table.busy=true;
		}
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

	Bill.prototype.$save = function(){
		// this.$$resource.set(this.id,this);
	};
	Bill.prototype.$close = function(){
		// this.$$resource.close(this.id);
	};

})();
