/* global angular */
'use strict';

angular.module('getix', [
	'ngRoute',
	'hmTouchEvents',
	'ngAnimate',
	'LocalStorageModule',
	'fx.animations'
]);

//fix for ios elastic scroll
document.addEventListener('touchmove', function (e) {
	e.preventDefault();
}, false);