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
		this.loginError=false;
	};

	Users.prototype.login = function(){
		if(md5(this.pass)===this.chosen.pswHash){
			this.loginError=false;
			this.$location.path('/pos');
		}
		else {
			this.loginError=true;
		}
	};

	Users.$inject = ['Init','$location'];
	angular.module('getix').controller('Users', Users);
})();