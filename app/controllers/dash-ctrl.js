/* global angular */
'use strict';

(function(){
	function Dash () {
		this.data = [
			{
				hour:7,
				balance:120
			},{
				hour:8,
				balance:152
			},{
				hour:9,
				balance:164
			},{
				hour:10,
				balance:215
			},{
				hour:11,
				balance:296
			},{
				hour:12,
				balance:310
			},{
				hour:13,
				balance:450
			},{
				hour:14,
				balance:560
			},{
				hour:15,
				balance:580
			},{
				hour:16,
				balance:605
			},{
				hour:17,
				balance:640
			},{
				hour:18,
				balance:0
			},{
				hour:19,
				balance:0
			},{
				hour:20,
				balance:0
			},{
				hour:21,
				balance:0
			},{
				hour:22,
				balance:0
			},{
				hour:23,
				balance:0
			}
		];
	};

	angular.module('getix').controller('Dash',Dash);
})();