/* global angular */
'use strict';
(function(){

	angular.module('getix').factory('UIService', [function () {
		
		var dragging = {
			on:false
		};
	
		return {
			isDragging:function(pass){
				if(pass!==undefined){
					dragging.on=pass;
				}
				return dragging;
			}
		};
	}]);
})();