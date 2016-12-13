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

        options = options || {};

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
        
        $clearButton.on('click', function() {
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
     * Tokenized search that returns the matches found in the list or table.
     */
    function findMatches($wrapper, selector, criteria) {
        var criteriaTokens = criteria.trim().toLowerCase().split(' '); 

        var $matches = $wrapper.find(selector).filter(function(idx, element) {
            var selectorText = $(element).text().toLowerCase();            
            return criteriaTokens.every(function(tokenValue) {
                return selectorText.indexOf(tokenValue) > -1;
            });
        });

        return $matches;
    }

    /*
     * Filters an unordered list based on the user's input.
     */
    function filterList($wrapper, criteria) {
        var $matches = findMatches($wrapper, 'ul li', criteria);

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
     * Since the current table stripes are based on :nth-child(), they'll get funky
     * when the filter removes rows. So, let's reset the row striping when there's a search. 
     * This is using inline styles since there's inline CSS that sets the color and 
     * has to be overwritten.
     */
    function resetTableStripes($matches, selector, color) {
        $matches.parent().children(selector).has('td').css('background-color', color);
    }

    /*
     * Filters an table of links and content based on the user's input.
     */
    function filterTable($wrapper, criteria) {
        var $matches = findMatches($wrapper, 'tr', criteria);

        $wrapper.find('tr').has('td').not($matches).hide();
        $matches.show();

        if ($matches.length === 0) {
            $errorMessage.show();
            $wrapper.find('tr').has('th').hide();
        } else {
            $errorMessage.hide();
            $wrapper.find('tr').has('th').show();
        }

        resetTableStripes($matches, 'tr:visible:even', '#ebebeb');
        resetTableStripes($matches, 'tr:visible:odd', '#fff');
    }

    /*
     * Clears the filter and displays all nodes in the list.
     */
    function clearFilter($wrapper, $searchbox) {
        $wrapper.find('li, div, tr').show();
        $searchbox.val('');
    }

    /* Reveal! */

    return {
        init: init
    };

})(jQuery);
