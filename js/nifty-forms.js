namespacer('baltimoreCounty');

baltimoreCounty.niftyForms = (function() {

    var checkboxesAndRadiosLabelSelector = '.seCheckboxLabel, .seRadioLabel',
        checkboxesAndRadiosSelector = '.seCheckbox, .seRadio',
        checkboxesSelector = '.seCheckbox',
        radiosSelector = '.seRadio',

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
        },

        singleCheckboxAndRadioFilter = function(index, item) {
            return $(item).siblings('label').length === 0;
        };

    /*
     * Main
     */
    $(function() {

        var $forms = $('form'),
            $singleCheckboxes = $forms.find(checkboxesSelector).filter(singleCheckboxAndRadioFilter),
            $singleRadios = $forms.find(radiosSelector).filter(singleCheckboxAndRadioFilter),
            $singleCheckboxWrappers = $singleCheckboxes.wrap('<div class="seCheckboxLabel"></div>');
            $singleRadioWrappers = $singleRadios.wrap('<div class="seRadioLabel"></div>'),
            $checkboxAndRadioLabels = $forms.find(checkboxesAndRadiosLabelSelector).add($singleCheckboxWrappers).add($singleRadioWrappers);

        $checkboxAndRadioLabels.add().add().on('click', makeItemCheckedOnClickHandler)
            .on('keyup', makeItemCheckedOnKeyupHandler)
            .attr('tabindex', '0')
            .attr('aria-checked', false);
        
        $checkboxAndRadioLabels.filter('.seCheckboxLabel').attr('role', 'checkbox');
        $checkboxAndRadioLabels.filter('.seRadioLabel').attr('role', 'radio');        
    });

})();