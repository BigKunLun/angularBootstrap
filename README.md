# angularBootstrap

A very simple AngularJS Lib used for dealyed start.Load it before app.js and then use it like this:

```javascript
angular.module('javis').run(['$rootScope','USER_INFO', function($rootScope,USER_INFO) {
  $rootScope.userInfo = USER_INFO;
}]);

angularBootstrap.startBootstrap({
  module: 'javis',
  resolve: {
    USER_INFO: ['$http', function ($http) {
      return $http.get('/api/user/current');
    }]
  }
});
```
