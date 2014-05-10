/* global angular */

'use strict';
(function(){
	angular.module('getix')
	.filter('money',[
		function(){
			return function(d){
				var curTpl = '${{money}}',
					formatPrice = function(num){
					if(num===0){
						return '0.00';
					}
					if(num){
						return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					}
					else {
						return '';
					}
				};
				return curTpl.replace('{{money}}',formatPrice(d));
			};
		}
	]);

})();