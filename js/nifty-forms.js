namespacer('baltimoreCounty');

/*
 * Adds nifty checkboxes and radio buttons to a Site Executive form.
 */
baltimoreCounty.niftyForms = (function() {

    var checkboxesAndRadiosLabelSelector = '.seCheckboxLabel, .seRadioLabel',
        checkboxesAndRadiosSelector = '.seCheckbox, .seRadio',
        checkboxesSelector = '.seCheckbox',
        radiosSelector = '.seRadio',

        focusChanged = function(e) {
            var $input = $(e.currentTarget),
                inputId = $input.attr('id'),
                $label = $('label[for="' + inputId + '"]');
            
            removeFocus();
            $label.addClass('is-focused');
        },

        inputChanged = function(e) {
            var $input = $(e.currentTarget),
                inputId = $input.attr('id'),
                isChecked = $input.prop('checked'),
                $label = $('label[for="' + inputId + '"]');
                
                if ($input.is('[type=radio]')) {
                    var radioName = $input.attr('name')
                    var $radioInputs = $('input[name="' + radioName + '"]');

                    $radioInputs.each(function() {
                        var $radioLabel = $('label[for="' + $(this).attr('id') + '"]');

                        $radioLabel.removeClass('checked');
                    });
                }

            $label.toggleClass('checked')
        },

        /*
         * Toggle the click label's checkbox/radion button. This is necessary because
         * the niftyness is the ::before pseudo-element of the label tag, and not the 
         * input itself.
         */
        toggleChecked = function($label) {
            var labelFor = $label.attr('for'),
                $input = $label.siblings('#' + labelFor);

            if (!$input.length)
                $input = $label.find('input').first();

            if ($input.is('[type=radio]')) {
                var inputName = $input.attr('name');

                $label.closest('form').find('input[name=' + inputName + ']')
                    .prop('checked', false)
                    .siblings(checkboxesAndRadiosLabelSelector)
                    .removeClass('checked');
            }

            $input.focus();

            $label.toggleClass('checked');
            $input.prop('checked', $label.hasClass('checked'));
        },

        /*
         * Toggles the checkedness of the underlying input when the user clicks the label. 
         */
        makeItemCheckedOnClickHandler = function(e) {
            var $label = $(e.target);
            
            toggleChecked($label);
        },

        /*
         * Toggles the checkedness of the underlying input when the user hits the space bar.
         */
        makeItemCheckedOnKeyupHandler = function(e) {
            var $label = $(e.target),
                KEYCODE_SPACEBAR = 32;

                if (e.which === KEYCODE_SPACEBAR) {
                    e.preventDefault();
                    toggleChecked($label);
                }
        },

        removeFocus = function() {
            $('.is-focused').removeClass('is-focused');
        }

        /*
         * Filter that finds checkboxes and radios that aren't in a list.
         */ 
        singleCheckboxAndRadioFilter = function(index, item) {
            return $(item).siblings('label').length === 0;
        };

    /*
     * Attach events and add aria roles to labels. 
     */
    $(function() {

        var $forms = $('form'),
            $singleCheckboxes = $forms.find(checkboxesSelector).filter(singleCheckboxAndRadioFilter),
            $singleRadios = $forms.find(radiosSelector).filter(singleCheckboxAndRadioFilter),
            $singleCheckboxWrappers = $singleCheckboxes.wrap('<div class="seCheckboxLabel"></div>'),
            $singleRadioWrappers = $singleRadios.wrap('<div class="seRadioLabel"></div>'),
            $checkboxAndRadioLabels = $forms.find(checkboxesAndRadiosLabelSelector).add($singleCheckboxWrappers).add($singleRadioWrappers);

        $checkboxAndRadioLabels
            .on('click', makeItemCheckedOnClickHandler)
            .on('keyup', makeItemCheckedOnKeyupHandler)
            // .attr('tabindex', '-1')
            .attr('aria-checked', false);

        $(document)
            .on('change', checkboxesAndRadiosSelector, inputChanged)
            .on('focus', checkboxesAndRadiosSelector, focusChanged)
            .on('blur', checkboxesAndRadiosSelector, removeFocus);
        
        $checkboxAndRadioLabels.filter('.seCheckboxLabel').attr('role', 'checkbox');
        $checkboxAndRadioLabels.filter('.seRadioLabel').attr('role', 'radio');        
    });

    /* test code */
    return {
        toggleChecked: toggleChecked
    };
    /* end test code */

})();