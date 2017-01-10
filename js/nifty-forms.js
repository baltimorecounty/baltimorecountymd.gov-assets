namespacer('baltimoreCounty');

baltimoreCounty.niftyForms = (function() {

    var checkboxesAndRadiosLabelSelector = '.seCheckboxLabel, .seRadioLabel',

        toggleChecked = function($label) {
            var labelFor = $label.attr('for'),
                $input = $label.siblings('#' + labelFor);

            if ($input.is('[type=radio]')) {
                var inputName = $input.attr('name');

                $label.closest('form').find('input[name=' + inputName + ']')
                    .prop('checked', false)
                    .siblings(checkboxesAndRadiosLabelSelector)
                    .removeClass('checked');
            }
        
            $label.toggleClass('checked');
            $input.prop('checked', $label.hasClass('checked'));
      },

        makeItemCheckedOnClickHandler = function(e) {
            var $label = $(e.target);
            
            e.preventDefault();
            toggleChecked($label);
        },

        makeItemCheckedOnKeyupHandler = function(e) {
            var $label = $(e.target),
                KEYCODE_SPACEBAR = 32;

                if (e.which === KEYCODE_SPACEBAR) {
                    e.preventDefault();
                    toggleChecked($label);
                }
        };

    /*
     * Main
     */
    $(function() {
        $('form').find(checkboxesAndRadiosLabelSelector)
            .on('click', makeItemCheckedOnClickHandler)
            .on('keyup', makeItemCheckedOnKeyupHandler)
            .attr('tabindex', '0');
    });

})();