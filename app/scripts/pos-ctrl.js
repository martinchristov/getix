/* global angular */
'use strict';
(function(){
	var POS = function(appData, UIService, $timeout){
		this.categories = appData.data.menu.data;
		this.currentCategoryIndex = 0;
		
		this.shown = 'categories';
		this.groups = this.categories[0].groups.data;
		this.searchResults = null; //todo this
		this.bills = null;

		this.dragging = UIService.isDragging();
		UIService.tables = appData.data.tables.data;
		POS.$timeout = $timeout;

		this.search='';
		this.searching=false;
	};
	POS.prototype.show = function(index){
		var _this = this;
		function switchCat () {
			_this.currentCategoryIndex = index;
			_this.groups = _this.categories[index].groups.data;
		}
		if(this.bills.allUp){
			switchCat();
			POS.$timeout(function(){_this.bills.allUp=false;},100);
		} else {
			switchCat();
		}
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

})();