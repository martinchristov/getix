/* global angular */
'use strict';

(function(){
	function Dash ($timeout) {
		var self = this;
		this.cats = [];
		$timeout(function(){
			self.cats = self.data.categories;
		},1000);
		this.data = {
			total:812.2,
			categories:[
				{
					key:'cold-drinks',
					name:'Cold Drinks',
					revenue: 120
				},
				{
					key:'hot-drinks',
					name:'Hot Drinks',
					revenue: 56
				},
				{
					key:'cocktails',
					name:'Cocktails',
					revenue: 94
				},
				{
					key:'liqueur',
					name:'Liqueur',
					revenue: 211
				}
			],
			graph:[
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
			]
		};
	};

	Dash.$inject = ['$timeout'];

	angular.module('getix').controller('Dash',Dash);
})();