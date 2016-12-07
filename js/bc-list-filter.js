var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.listFilter = (function($) {

    /* Private Properties ******************************************/

    var that = this;
    that.options = {};

    /* Public Methods ******************************************/ 

    /*
     * Initialize the filter, and activate it.
     */
    function init(options) {
        that.options.listWrapperSelector = options.listWrapper || '.bc-filter-content';
        that.options.listSearchBoxSelector = options.searchBox || '.bc-filter-form .bc-filter-form-filter';
        that.options.listClearButtonSelector = options.clearButton || '.bc-filter-form .bc-filter-form-clearButton';
        that.options.listErrorMessageSelector = options.errorMessage || '.bc-filter-noResults';

        that.$listWrapper = safeLoad(that.options.listWrapperSelector);
        that.$searchBox = safeLoad(that.options.listSearchBoxSelector);
        that.$clearButton = safeLoad(that.options.listClearButtonSelector);
        that.$errorMessage = safeLoad(that.options.listErrorMessageSelector);

        that.$errorMessage.hide();

        that.$searchBox.on('keyup', function(eventObject) {
            filterList(that.$listWrapper, $(eventObject.currentTarget).val());
        });
        
        $(that.options.listClearButtonSelector).on('click', function() {
            clearFilter(that.$listWrapper, that.$searchBox);
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
     * Filters the list based on the user's input.
     */
    function filterList($listWrapper, criteria) {
        var $matches = $listWrapper.find('ul li').filter(function(idx, element) {            
            if ($(element).text().toLowerCase().indexOf(criteria.toLowerCase()) > -1)
                return true;
            return false;
        });

        $list.find('li').not($matches).hide();
        $matches.show();

        var $divsWithResults = $list.children('div').find('li').not('[style="display: none;"]').closest('div');

        $list.children('div').not($divsWithResults).hide();
        $divsWithResults.show();

        if ($divsWithResults.length === 0)
            $(that.options.listErrorMessageSelector).show();
        else
            $(that.options.listErrorMessageSelector).hide();
    }

    /*
     * Clears the filter and displays all nodes in the list.
     */
    function clearFilter($listWrapper, $searchbox) {
        $listWrapper.find('li').show();
        $searchbox.val('');
    }

    /* Reveal! */

    return {
        init: init
    };

})(jQuery);
