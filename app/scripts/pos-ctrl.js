/* global angular */
'use strict';
(function(){
	var POS = function(appData, UIService, $timeout){
		this.categories = appData.data.menu.data;
		this.currentCategoryIndex = 0;
		
		this.shown = 'categories';
		this.groups = this.categories[0].groups.data;
		this.searchResults = getSearchResults(this.categories);
		this.bills = null;

		this.dragging = UIService.isDragging();
		UIService.tables = appData.data.tables.data;
		POS.$timeout = $timeout;

		this.search='';
		this.searching=false;
	};
	POS.prototype.show = function(index){
		var _this = this;
		this.searching=false;
		function switchCat () {
			_this.currentCategoryIndex = index;
			_this.groups = _this.categories[index].groups.data;
		}
		switchCat();
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

	POS.$inject = ['appData','UIService', '$timeout'];

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