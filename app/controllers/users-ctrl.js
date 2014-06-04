/* global angular,md5 */
'use strict';

(function(){

	var Users = function(Init, $location){
		var self = this;
		Init.getUsers().then(function(d){
			self.data = d;
		});
		this.chosen = null;
		this.$location = $location;
	};

	Users.prototype.login = function(){
		if(md5(this.pass)===this.chosen.pswHash){
			console.log('login success');
		}
		else {
			console.log('login failure');
		}

		this.$location.path('/pos');
	};

	Users.$inject = ['Init','$location'];
	angular.module('getix').controller('Users', Users);
})();