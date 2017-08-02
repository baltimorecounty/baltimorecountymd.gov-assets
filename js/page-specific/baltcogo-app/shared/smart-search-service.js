(function (app) {
  app.factory('smartSearch', ['$window','$log', smartSearch]);

  function smartSearch($window, $log) {
    function SmartSearchFactory($window, $log) {
      if (!$window.Fuse) {
        $log.error("Unable to load the smart search, we probably need to do something else. You probably forgot to include the reference to the fuse library");
        return null;
      }
      return $window.Fuse;
    }

    return SmartSearchFactory($window, $log);
  }
})(angular.module('baltcogoApp'));

