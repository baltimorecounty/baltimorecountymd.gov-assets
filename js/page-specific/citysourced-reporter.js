namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.citySourcedReporter = (function($, jsonTools, undefined) {
    
    var selectOptionData,

        init = function(jsonDocumentUrl) {
            var $form = $('#citysourced-reporter-form'),
                $categories = $form.find('#category-selection'),
                $panels = $form.find('.panel'),
                $steps = $('.bc-citysourced-reporter-steps li'),
                handlerData = {
                    animationFactor: 300,
                    $form: $form,
                    $panels: $panels,
                    $steps: $steps,
                    $firstPanel: $panels.first(),
                    $lastPanel: $panels.last(),
                    $prevButton: $('#prevButton'),
                    $nextButton: $('#nextButton'),
                    $fileReportButton: $('#fileReportButton')               
                };

            $.ajax(jsonDocumentUrl).done(function(data) {
                selectOptionData = data;
                createSelectAndLoadOptions(selectOptionData, $categories, 1);
            });

            handlerData.$nextButton.on('click', handlerData, nextButtonClickHandler);
            handlerData.$prevButton.on('click', handlerData, prevButtonClickHandler);
            handlerData.$fileReportButton.on('click', handlerData, fileReportButtonClickHandler);
        },

        /**
         * Click handler for the 'File Your Report' button. Runs basic validation, then submits.
         */
        fileReportButtonClickHandler = function(event) {
            var fieldIds = ['report-category','description','address','map-latitude','map-longitude','firstName','lastName','email','phone'];            
            if (validate(fieldIds)) {
                alert('Woohoo.');
            }
        },

        /**
         * Click handler for the 'next' button, which flips to the next panel.
         */
        nextButtonClickHandler = function(event) {
            var $visiblePanel = event.data.$panels.filter(':visible'),
                $nextPanel = $visiblePanel.next('.panel').first();

            if ($nextPanel.is(event.data.$lastPanel)) {
                $(event.target).addClass('hidden');
                event.data.$fileReportButton.removeClass('hidden');
            } else
                $(event.target).removeClass('hidden');

            if ($nextPanel.length) {
                $visiblePanel.fadeOut(event.data.animationFactor, function() {
                    $nextPanel.fadeIn(event.data.animationFactor);
                    event.data.$steps.eq($nextPanel.index()).toggleClass('highlight');
                    event.data.$prevButton.removeClass('hidden');

                    if ($nextPanel.find('#map').length) {
                        if (google.maps) {
                            var center = map.getCenter();
                            google.maps.event.trigger(map, 'resize');
                            map.setCenter(center);
                        }
                    }
                });
            }

            $('html, body').animate({
                scrollTop: $('#mainContent').offset().top
            }, event.data.animationFactor);
        },

        /**
         * Click handler for the 'previous' button, which flips to the previous panel.
         */
        prevButtonClickHandler = function(event) {
            var $visiblePanel = event.data.$panels.filter(':visible'),
                $nextPanel = $visiblePanel.prev('.panel').first();
            
            event.data.$fileReportButton.addClass('hidden');

            if ($nextPanel.is(event.data.$firstPanel))
                $(event.target).addClass('hidden');
            else
                $(event.target).removeClass('hidden');

            if ($nextPanel.length) {
                event.data.$steps.eq($nextPanel.index() + 1).toggleClass('highlight');
                $visiblePanel.fadeOut(event.data.animationFactor, function() {
                    $nextPanel.fadeIn(event.data.animationFactor);
                    event.data.$nextButton.removeClass('hidden');
                });
            }

            $('html, body').animate({
                scrollTop: $('#mainContent').offset().top
            }, event.data.animationFactor);
        },

        /**
         * Creates the series of dropdowns for the category selection.
         */
        createSelectAndLoadOptions = function(data, $parent, depth) {
            var $select = $('<select>', {
                id: 'categories[' + depth + ']'
            });            
            $parent.append($select);

            var $option = $('<option>', {
                value: -1,
                text: '--- Select a request category ---',
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

        /**
         * Updates the category dropdown options and visibility when the selected item changes.
         */
        selectChangeHandler = function(e) {
            var $select = $(e.target),
                selectedValue = $select.val(),
                existingSelectCount,
                $trackingField = $('#report-category');

            $select.nextAll().remove();

            if (selectedValue === '-1') {
                $trackingField.val('');
                return;
            }            

            existingSelectCount = $select.siblings('select').length + 1;

            var jsonSubtree = jsonTools.getSubtree(e.data.fragment, 'name', 'types', selectedValue);

            if (jsonSubtree)
                createSelectAndLoadOptions(jsonSubtree, $select.parent(), existingSelectCount + 1);
            else 
                $trackingField.val(selectedValue);
        },

        /**
         * Simple validation that only makes sure a value is present.
         */
        validate = function(fieldIds) {
            console.log(this);
            var errorFieldIds = [];

            $.each(fieldIds, function(idx, item) {
                var $field = $('#' + item);

                if (!$field.val()) {
                    errorFieldIds.push(item);
                    $field.parent().addClass('error');
                } else {
                    $field.parent().removeClass('error');
                }
            });

            if (errorFieldIds.length) {
                return false;
            } else {
                console.log('success');
                return true;
            }
        };

    return {
        init: init
    };

})(jQuery, baltimoreCounty.utility.jsonTools);

$(function() {
    /* Auto-load the category data */
    baltimoreCounty.pageSpecific.citySourcedReporter.init('/sebin/q/j/categories.json');
});