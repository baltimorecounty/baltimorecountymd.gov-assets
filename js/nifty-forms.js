namespacer('baltimoreCounty');

baltimoreCounty.niftyForms = (function() {

    var checkboxesAndRadiosLabelSelector = '.seCheckboxLabel, .seRadioLabel',

        init = function($form) {
            $form.find(checkboxesAndRadiosLabelSelector).on('click', function() {
                var $current = $(this),
                    $input = $current.siblings('input').first();

                $current.toggleClass('checked');

                // TODO: Tabbable (tab index?) and keyboardable (keyup)
                // $('.seCheckboxLabel').on('keyup', function(e) { if (e.keyCode !== 9) $(e.target).toggleClass('checked') })
            });
        };

    return {
        init: init
    };

})();