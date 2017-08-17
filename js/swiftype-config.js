namespacer('baltimoreCounty');

baltimoreCounty.swifTypeConfig = (function swifTypeConfig($, undefined) {
	var customRenderFunction = function customRenderFunction(document_type, item) {
		var highlight = item.highlight.body || item.highlight.sections || item.highlight.title;
		var out = '';
		out = out.concat('<div class="st-autocomplete-search-result">');
		out = out.concat('<a href="' + item.url + '">' + item.title + '<br/><span>' + highlight + '</span></a>');
		out = out.concat('</div>');
		return out;
	};

	return {
		customRenderFunction: customRenderFunction
	};
}(jQuery));


$(function swifTypeConfig() {
	$('#q').swiftype({
		renderFunction: baltimoreCounty.swifTypeConfig.customRenderFunction,
		engineKey: '4nioYNESzQAAvy7fKxeY'
	});
});
