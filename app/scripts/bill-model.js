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
			lastGroupItem : {price:0},
			groupIndex:0,
			timestamp: new Date().getTime(),
			userId: Bill.User.getUserId()
		});

		this.$unwrap(futureBillData);
		this.newStack();
	}
	Bill.$factory = [
		'$timeout',
		'User',
		'gxResource',
		function($timeout, User, Resource){
			_.extend(Bill,{
				$timeout:$timeout,
				User:User,
				$$resource:new Resource('/api/v2/bills')
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
				quantity:1,
				timestamp:new Date().getTime()
			})
		);

		this.$save();
	};
	Bill.prototype.remove = function(item){
		this.openedStack.items = _.reject(this.openedStack.items,item);

		this.$save();
	};

	Bill.prototype.group = function(){
		this.groupIndex++;
		var groupItem = {
			items:[],
			price:0,
			quantity:1,
			type:'group',
			id:this.groupIndex,
			timestamp: new Date().getTime()
		},
			self = this;

		for (var i = this.openedStack.items.length - 1; i >= 0; i--) {
			if(self.openedStack.items[i].checked){
				groupItem.price+=self.openedStack.items[i].price*self.openedStack.items[i].quantity;
				groupItem.items.push(self.openedStack.items[i]);
				self.openedStack.items.splice(i,1);
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
		var self=this,
			idDict={};

		var stack = _.extend(_.clone(self.openedStack),{
			total: 0
		});
		//walk through the openedStack and combine items
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
		this.$close();
	};

	Bill.prototype.cancel = function(){

	};

	Bill.prototype.total = function(){
		var total=0;
		if(this.closedStack!==null){
			total=this.closedStack.total;
		}
		for(var i=0;i<this.openedStack.items.length;i++){
			total+=this.openedStack.items[i].price*this.openedStack.items[i].quantity;
		}
		return total;
	};

	Bill.prototype.$save = function(){
		Bill.$$resource.set(this.timestamp,this);
	};
	Bill.prototype.$close = function(){
		Bill.$$resource.close(this.timestamp);
	};

})();
