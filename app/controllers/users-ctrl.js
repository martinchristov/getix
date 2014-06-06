/* global angular,md5 */
'use strict';

(function(){

	var Users = function(Init, $location, User){
		var self = this;
		Init.getUsers().then(function(d){
			self.data = d;
		});
		this.User = User;
		this.chosen = null;
		this.$location = $location;
		this.loginError=false;
	};

	Users.prototype.login = function(){
		if(md5(this.pass)===this.chosen.pswHash){
			this.loginError=false;
			this.User.login(this.chosen);
			this.$location.path('/pos');
		}
		else {
			this.loginError=true;
		}
	};

	Users.$inject = ['Init','$location', 'User'];
	angular.module('getix').controller('Users', Users);
})();