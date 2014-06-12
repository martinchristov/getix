/* global angular,_ */
'use strict';
(function(){
	var POS = function(appData, UIService, $timeout, $scope, User){

		_.extend(this,{
			$timeout:$timeout,
			UIService: UIService,
			User: User
		});
		console.log(User.getUser());
		this.categories = appData.menu.data;
		this.currentCategoryIndex = 0;
		
		this.shown = 'categories';
		this.groups = this.categories[0].groups.data;
		this.searchResults = getSearchResults(this.categories);
		this.bills = null;

		this.dragging = UIService.isDragging();
		UIService.tables = appData.tables.data;
		this.$timeout = $timeout;
		this.UIService = UIService;

		this.search='';
		this.searching=false;

		this.itemToResize=null;

		var _this = this;
		$scope.$on('barcodeScanned',function(e,barcode){
			//search for item
			for(var i=0;i<_this.searchResults.length;i++){
				if(_this.searchResults[i].code===barcode){
					_this.bills.addToCurrent(_this.searchResults[i]);
					$scope.$apply();
					break;
				}
			}
		});
	};
	POS.prototype.show = function(index){
		var self = this;
		this.searching=false;
		function switchCat () {
			self.currentCategoryIndex = index;
			self.groups = self.categories[index].groups.data;
		}
		switchCat();
		this.$timeout(function(){
			self.showDashboard=false;
		},100);
		
	};
	POS.prototype.toggleBills = function(){
		if(this.shown==='bills'){
			this.shown='categories';
		}
		else {
			this.shown='bills';
			this.bills.current=-1;
		}
	};

	POS.prototype.setResizeItem = function(item){
		this.itemToResize = item;
		this.UIService.setResizing(true);
	};

	POS.prototype.resizeItem = function(item){
		// this.itemToResize = item;
		var self = this;
		if(item.size<3){
			item.size++;
		}
		else {
			item.size=1;
		}
		this.itemToResize=null;
		setTimeout(function(){
			self.UIService.setResizing(false);
		},100);
		
	};

	POS.$inject = ['appData','UIService', '$timeout', '$scope', 'User'];

	angular.module('getix').controller('POS',POS);

	function getSearchResults(categories){
		var res = [];
		for(var c=0;c<categories.length;c++){
			for(var g=0;g<categories[c].groups.data.length;g++){
				for(var i=0;i<categories[c].groups.data[g].items.data.length;i++){
					res.push(categories[c].groups.data[g].items.data[i]);
				}
			}
		}
		return res;
	}
})();