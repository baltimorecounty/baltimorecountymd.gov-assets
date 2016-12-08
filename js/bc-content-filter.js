var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.contentFilter = (function($) {

    /* Private Properties ******************************************/

    var that = this;
    that.options = {};

    /* Public Methods ******************************************/ 

    /*
     * Initialize the filter, and activate it.
     */
    function init(options) {
        that.options.wrapperSelector = options.wrapper || '.bc-filter-content';
        that.options.searchBoxSelector = options.searchBox || '.bc-filter-form .bc-filter-form-filter';
        that.options.clearButtonSelector = options.clearButton || '.bc-filter-form .bc-filter-form-clearButton';
        that.options.errorMessageSelector = options.errorMessage || '.bc-filter-noResults';
        that.options.contentType = options.contentType || 'list';

        that.$wrapper = safeLoad(that.options.wrapperSelector);
        that.$searchBox = safeLoad(that.options.searchBoxSelector);
        that.$clearButton = safeLoad(that.options.clearButtonSelector);
        that.$errorMessage = safeLoad(that.options.errorMessageSelector);
        that.contentType = that.options.contentType;

        that.$errorMessage.hide();

        that.$searchBox.on('keyup', function(eventObject) {

            switch (that.contentType) {
                case 'table':
                    filterTable(that.$wrapper, $(eventObject.currentTarget).val());
                    break;
                case 'list':
                    filterList(that.$wrapper, $(eventObject.currentTarget).val());
                    break;
            }
            
        });
        
        $(that.options.listClearButtonSelector).on('click', function() {
            clearFilter(that.$wrapper, that.$searchBox);
        });
    }      

    /* Private Methods ******************************************/

    function safeLoad(selector) {
        var $items = $(selector);
        if ($items.length === 0)
            throw 'No elements for "' + selector + '" were found.';
        return $items;
    }

    /*
     * Filters an unordered list based on the user's input.
     */
    function filterList($wrapper, criteria) {
        var $matches = $wrapper.find('ul li').filter(function(idx, element) {            
            if ($(element).text().toLowerCase().indexOf(criteria.toLowerCase()) > -1)
                return true;
            return false;
        });

        $wrapper.find('li').not($matches).hide();
        $matches.show();

        var $divsWithResults = $wrapper.children('div').find('li').not('[style="display: none;"]').closest('div');

        $wrapper.children('div').not($divsWithResults).hide();
        $divsWithResults.show();

        if ($divsWithResults.length === 0)
            $errorMessage.show();
        else
            $errorMessage.hide();
    }

    /*
     * Filters an table of links and content based on the user's input.
     */
    function filterTable($wrapper, criteria) {
        var $matches = $wrapper.find('table tr').filter(function(idx, element) {    

            console.log($(element).text().toLowerCase().indexOf(criteria.toLowerCase()));

            if ($(element).text().toLowerCase().indexOf(criteria.toLowerCase()) > -1)
                return true;
            return false;
        });

        $wrapper.find('tr').has('td').not($matches).hide();
        $matches.show();

        if ($matches.length === 0)
            $errorMessage.show();
        else
            $errorMessage.hide();
    }

    /*
     * Clears the filter and displays all nodes in the list.
     */
    function clearFilter($wrapper, $searchbox) {
        $wrapper.find('li, div').show();
        $searchbox.val('');
    }

    /* Reveal! */

    return {
        init: init
    };

})(jQuery);
