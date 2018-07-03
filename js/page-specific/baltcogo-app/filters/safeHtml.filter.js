(function safeHtmlFilter(app) {
	app.filter('safeHtml', ['$sce', safeHtml]);

	function safeHtml($sce) {
		return function (val) {
			return $sce.trustAsHtml(val);
		};
	}
}(angular.module('baltcogoApp')));
