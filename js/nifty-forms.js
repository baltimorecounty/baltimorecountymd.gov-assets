namespacer('baltimoreCounty');

/*
 * Adds nifty checkboxes and radio buttons to a Site Executive form.
 */
baltimoreCounty.niftyForms = (function() {

	var checkboxesAndRadiosLabelSelector = '.seCheckboxLabel, .seRadioLabel',
		checkboxesAndRadiosSelector = '.seCheckbox, .seRadio',
		checkboxesSelector = '.seCheckbox',
		radiosSelector = '.seRadio',
		$focusedElement,

		focusChanged = function(e) {
			var $target = $(e.target),
				inputId = $target.attr('id'),
				$label = $('label[for="' + inputId + '"]');
			
			$focusedElement = undefined;

			if ($target.parent().is(checkboxesAndRadiosLabelSelector)) {
				$focusedElement = $target.parent();
			} else {
				if ($target.is(checkboxesAndRadiosLabelSelector)) { 
					$focusedElement = $target;
				} else {
					$focusedElement = $label;
				}
			}

			removeFocus();

			if ($focusedElement && $focusedElement.length)
				$focusedElement.addClass('is-focused');
		},

		makeItemCheckedOnClickHandler = function(e) {
			var $target = $(e.currentTarget);
			$target.find('input').trigger('click');
		},

		/*
		 * Toggles the checkedness of the underlying input when the user hits the space bar.
		 */
		makeItemCheckedOnKeyupHandler = function(e) {
			var $target = $(e.currentTarget);
			var $input = $target.find('input');
			var keyCode = e.which || e.keyCode;
			var KEYCODE_SPACEBAR = 32;

			if (keyCode === KEYCODE_SPACEBAR) {	
				$input.prop('checked', !$input.prop('checked'));
/*
				if ($target.is(checkboxesAndRadiosLabelSelector)) {
					if ($input.prop('checked')) {						
						$target.addClass('checked');
					} else	{
						$target.removeClass('checked');
					}
				}
*/			}
		},

		removeFocus = function() {
			if ($focusedElement)
				$focusedElement.removeClass('is-focused');
		}

		/*
		 * Filter that finds checkboxes and radios that aren't in a list.
		 */ 
		singleCheckboxAndRadioFilter = function(index, item) {
			return $(item).siblings('label').length === 0;
		},	

		toggleLabelChecked = function(e) {
			var $target = $(e.target);
			var $label =  $target.siblings('label');
			var targetName = $target.attr('name');
			var targetId = $target.attr('id');

			if ($label.length === 0 && $target.is(checkboxesAndRadiosLabelSelector)) {
				$label = $target;
				$target = $(e.target);
			}

			if ($label.length === 0 && $target.parent().is(checkboxesAndRadiosLabelSelector)) {
				$label = $target.parent();
			}

			if ($target.is('input[type=radio]')) {
				var $radioButtonSet = $('input[name=' + targetName + ']');
				$radioButtonSet.not($('#' + targetId)).prop('checked', false).siblings('label').removeClass('checked');
			}

			if ($target.prop('checked')) {						
				$label.addClass('checked');
			} else	
				$label.removeClass('checked');
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

		$(checkboxesAndRadiosLabelSelector).on('keyup', makeItemCheckedOnKeyupHandler);
		$(checkboxesAndRadiosLabelSelector).on('click', makeItemCheckedOnClickHandler);

		$(document)
			.on('change', checkboxesAndRadiosSelector, toggleLabelChecked)
			.on('focus', checkboxesAndRadiosSelector, focusChanged)
			.on('blur', checkboxesAndRadiosSelector, removeFocus);
		
		//$singleCheckboxWrappers.parent().on('keyup', makeItemCheckedOnKeyupHandler).attr('tabindex', 0);

		$checkboxAndRadioLabels.filter('.seCheckboxLabel').attr('role', 'checkbox');
		$checkboxAndRadioLabels.filter('.seRadioLabel').attr('role', 'radio');        
	});

})();