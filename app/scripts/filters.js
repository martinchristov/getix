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
	])
	.filter('quantity',[
		function(){
			return function(d){
				if(d>=1){
					return d;
				}
				else if(d===0.67){
					return '2/3';
				}
				else if(d===0.5){
					return '1/2';
				}
				else if(d===0.34){
					return '1/3';
				}
			};
		}
	]);

})();