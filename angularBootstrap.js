(function(window,document){
  var $q;

  // 延迟启动Angular应用
  function angularBootstrap (module) {
    var deferred = $q.defer();
    angular.element(document).ready(function () {
    angular.bootstrap(document, [module]);
      deferred.resolve(true);
    });
    return deferred.promise;
  }

  // 启动
  function startBootstrap (opts) {
    var config = opts || {},
        module = config.module,
        injector,
        promises = [],
        constants = [];

    // 使用注入器加载应用
    injector = angular.injector(['ng'], angular.element(document));
    // 通过注入器加载$q服务
    $q = injector.get('$q');

    // resolve -> promise
    function callResolveFn (resolveFn, constName) {
      var result;

      constants.push({
        name: constName,
        moduleName: module
      });

      // 通过注入器返回resolveFn实例
      result = injector.instantiate(resolveFn);

      if (angular.isObject(result) && angular.isFunction(result.then)) {
        promises.push(result);
      } else {
        throw new Error('resolve should be return a promise');
      }
    }

    function doneCallbacks (results) {
      angular.forEach(results, function (value, index) {
        var result = value && value.data ? value.data : value,
            moduleName = constants[index].moduleName,
            constName = constants[index].name;
        // 注册常量服务
        angular.module(moduleName).constant(constName, result);
      });
      return angularBootstrap(module);
    }

    function failCallbacks (error) {
      if (angular.isFunction(config.onError)) {
        config.onError(error);
      }
    }

    angular.forEach(config.resolve, function (resolveFn, constName) {
      callResolveFn(resolveFn, constName);
    });

    return $q.all(promises).then(doneCallbacks, failCallbacks);
  }

  window.angularBootstrap = {
    startBootstrap: startBootstrap
  };
})(window,document)