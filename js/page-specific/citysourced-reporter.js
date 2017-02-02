namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.citySourcedReporter = (function($, jsonTools, undefined) {
    
    var selectOptionData,

        init = function(jsonDocumentUrl) {
            var $form = $('#citysourced-reporter-form'),
                $categories = $form.find('#category-selection'),
                $panels = $form.find('.panel'),
                handlerData = {
                    animationFactor: 300,
                    $form: $form,
                    $panels: $panels,
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
 
            handlerData.$prevButton.hide();
            handlerData.$fileReportButton.hide();
            handlerData.$firstPanel.fadeIn(handlerData.animationFactor);

            $form.on('submit', formSubmissionHandler);
            handlerData.$nextButton.on('click', handlerData, nextButtonClickHandler);
            handlerData.$prevButton.on('click', handlerData, prevButtonClickHandler);

        },

        /**
         * Click handler for the 'next' button, which flips to the next panel.
         */
        nextButtonClickHandler = function(event) {
            var $visiblePanel = event.data.$panels.filter(':visible'),
                $nextPanel = $visiblePanel.next('.panel').first();

            if ($nextPanel.is(event.data.$lastPanel)) {
                $(event.target).hide();
                event.data.$fileReportButton.show();
            } else
                $(event.target).show();

            if ($nextPanel.length) {
                $visiblePanel.fadeOut(event.data.animationFactor, function() {
                    $nextPanel.fadeIn(event.data.animationFactor);
                    event.data.$prevButton.show();                
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
            
            event.data.$fileReportButton.hide();

            if ($nextPanel.is(event.data.$firstPanel))
                $(event.target).hide();
            else
                $(event.target).show();

            if ($nextPanel.length) {
                $visiblePanel.fadeOut(event.data.animationFactor, function() {
                    $nextPanel.fadeIn(event.data.animationFactor);
                    event.data.$nextButton.show();
                });
            }

            $('html, body').animate({
                scrollTop: $('#mainContent').offset().top
            }, event.data.animationFactor);
        },

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
                    $field.removeClass('error');
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

})(jQuery, baltimoreCounty.utility.jsonTools);

$(function() {
    baltimoreCounty.pageSpecific.citySourcedReporter.init('/sebin/q/j/categories.json');
});