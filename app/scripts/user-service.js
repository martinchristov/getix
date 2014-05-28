var st;
(function () {

  var NAME_STORE = '_user';
  var KEY_STORE = '_key';

  var User = function (Server, localStorageService) {
    this.server = Server;
    st = this.store = localStorageService;
  }

  User.prototype.login = function (email, password, success, fail, context) {
    var data = {
      email: email,
      password: password
    }

    /* DEBUG * /
    return success.call(context, {
      'api_key': '123123123',
      'objName': 'andro'
    })
    /* */

    this.server.post('/api/v2/login/', data, function (response, status) {
      if (response.error) {
        return fail.call(context, response, status);
      } else {
        return success.call(context, reposnse, status);
      }
    });
  }

  User.prototype.setUser = function (name, key) {
    this.store.set(NAME_STORE, name);
    this.store.set(KEY_STORE, key);
    return this;
  }

  User.prototype.unsetUser = function () {
    this.store.remove(NAME_STORE);
    this.store.remove(KEY_STORE);
    return this;
  }

  User.prototype.getName = function () {
    return this.store.get(NAME_STORE);
  }

  User.prototype.getApiKey = function () {
    return this.store.get(KEY_STORE);
  }

  User.prototype.isAuthenticated = function () {
    return this.getName() ? true : false;
  }

  User.$inject = ['Server', 'localStorageService'];
  angular.module('getix').service('User', User);
})()