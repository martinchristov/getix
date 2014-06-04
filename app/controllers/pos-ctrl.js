/* global angular */
'use strict';
(function(){
	var POS = function(appData, UIService, $timeout, $scope){
		this.categories = appData.menu.data;
		this.currentCategoryIndex = 0;
		
		this.shown = 'categories';
		this.groups = this.categories[0].groups.data;
		this.searchResults = getSearchResults(this.categories);
		this.bills = null;

		this.dragging = UIService.isDragging();
		UIService.tables = appData.tables.data;
		POS.$timeout = $timeout;
		POS.UIService = UIService;

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
		var _this = this;
		this.searching=false;
		function switchCat () {
			_this.currentCategoryIndex = index;
			_this.groups = _this.categories[index].groups.data;
		}
		switchCat();
		POS.$timeout(function(){
			_this.showDashboard=false;
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
		POS.UIService.setResizing(true);
	};

	POS.prototype.resizeItem = function(item){
		// this.itemToResize = item;
		if(item.size<3){
			item.size++;
		}
		else {
			item.size=1;
		}
		this.itemToResize=null;
		setTimeout(function(){
			POS.UIService.setResizing(false);
		},100);
		
	};

	POS.prototype.fullscreen = function(){
		var doc = angular.element('html')[0],
			ison=(document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen);
	    
	    if(ison){
			if(doc.requestFullscreen){
				doc.requestFullscreen();
			} else if (doc.webkitRequestFullscreen){
			    doc.webkitRequestFullscreen();
			} else if (doc.mozRequestFullScreen) {
			    doc.mozRequestFullScreen();
			} else if (doc.msRequestFullscreen) {
			    doc.msRequestFullscreen();
			}
	    }
	    else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
			    document.webkitCancelFullScreen();
			} else if (document.mozCancelFullScreen) {
			    document.mozCancelFullScreen();
			} else if (document.msCancelFullScreen) {
			    document.msCancelFullScreen();
			}
	    }
		
	};

	POS.$inject = ['appData','UIService', '$timeout', '$scope'];

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