namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.citySourcedReporter = (function($, undefined) {
    
    var selectOptionData,
        $form = $('#citysourced-reporter-form'),
        $categories = $form.find('#categories');
        
        init = function(jsonDocumentUrl) {
            $form.on('submit', formSubmissionHandler);

            $.ajax(jsonDocumentUrl).done(function(data) {
                selectOptionData = data;

                createSelectAndLoadOptions(selectOptionData, $categories, 1);
            });
        },

        createSelectAndLoadOptions = function(data, $parent, depth) {
            var $select = $('<select>', {
                id: 'categories[' + depth + ']'
            });            
            $parent.append($select);

            var $option = $('<option>', {
                value: -1,
                text: '--- Select a request type ---',
                selected: 'selected'
            });
            $select.append($option);

            $.each(data, function(idx, item) {
                var $option = $('<option>', {
                    value: item.name,
                    text: item.name
                });
                $select.append($option);
            });

            $select.on('change', { fragment: data }, selectChangeHandler);
        },

        selectChangeHandler = function(e) {
            var $select = $(e.target),
                selectedValue = $select.val(),
                existingSelectCount,
                $trackingField = $('#report-category')

            $select.nextAll().remove();

            if (selectedValue === '-1') {
                $trackingField.val('');
                return;
            }            

            existingSelectCount = $select.siblings('select').length + 1;

            var jsonFragment = getJsonFragment(e.data.fragment, selectedValue);

            if (jsonFragment)
                createSelectAndLoadOptions(jsonFragment, $select.parent(), existingSelectCount + 1)
            else 
                $trackingField.val(selectedValue);
        },

        getJsonFragment = function(data, value) {
            var match;

            $.each(data, function(idx, item) {
                if (item.types) {
                    if (item.name === value) {
                        match = item.types;   
                        return false;                    
                    } else {
                        match = getJsonFragment(item.types, value);
                    }
                }
            });
            return match;
        },

        formSubmissionHandler = function(e) {
            var fieldIds = ['report-category','description','address','map-latitude','map-longitude','firstName','lastName','email','phone'];
            
            console.log(validate(fieldIds));

            e.preventDefault();
        },

        addressSearchHandler = function(e) {
            var $target = $(e.target);
        },

        validate = function(fieldIds) {
            var errorFieldIds = [];
            
            $.each(fieldIds, function(idx, item) {
                var $field = $('#' + item);

                if (!$field.val()) {
                    errorFieldIds.push(item);
                    $field.addClass('error');
                } else {
                    $field.removeClass('error')
                }
            });

            if (errorFieldIds.length) {
                console.log(errorFieldIds);
                return false;
            } else {
                console.log('success');
                return true;
            }
        };

    return {
        init: init
    };

})(jQuery);

$(function() {
    baltimoreCounty.pageSpecific.citySourcedReporter.init('/mockups/categories.json');
});