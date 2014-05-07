/* global angular,_ */
'use strict';
(function(){

	function Bill(){
		this.items = [];
	}
	Bill.$factory = [
		function(){
			return Bill;
		}
	];

	angular.module('getix').factory('gxBill', Bill.$factory);

	Bill.prototype.add = function(item){
		//add to the last item?
		if(this.items.length>0){
			if(this.items[this.items.length-1].id===item.id){
				this.items[this.items.length-1].quantity++;
				return;
			}
		}
		//add a new item
		this.items.push(
			_.extend(_.clone(item),{
				added:new Date(),
				quantity:1
			})
		);
	};
	Bill.prototype.total = function(){
		var total=0;
		for(var i=0;i<this.items.length;i++){
			total+=this.items[i].price*this.items[i].quantity;
		}
		return total;
	};

})();
