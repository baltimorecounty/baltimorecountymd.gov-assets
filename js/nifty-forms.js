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

		/*
		 * Toggles the checkedness of the underlying input when the user hits the space bar.
		 */
		makeItemCheckedOnKeyupHandler = function(e) {
			var $target = $(e.target);
			var keyCode = e.which || e.keyCode;
			var KEYCODE_SPACEBAR = 32;

			if (keyCode === KEYCODE_SPACEBAR) {	
				$target.find('input').trigger('click');
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
		},	

		toggleLabelChecked = function(e) {
			var $target = $(e.currentTarget);
			var $label =  $target.siblings('label');
			var targetName = $target.attr('name');
			var targetId = $target.attr('id');

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


		$(document).on('keyup', checkboxesAndRadiosLabelSelector + "," + checkboxesAndRadiosSelector, makeItemCheckedOnKeyupHandler);

		$(document)
			.on('change', checkboxesAndRadiosSelector, toggleLabelChecked)
			.on('focus', checkboxesAndRadiosSelector, focusChanged)
			.on('blur', checkboxesAndRadiosSelector, removeFocus);
		
		$singleCheckboxWrappers.parent().on('keyup', makeItemCheckedOnKeyupHandler).attr('tabindex', -1);

		$checkboxAndRadioLabels.filter('.seCheckboxLabel').attr('role', 'checkbox');
		$checkboxAndRadioLabels.filter('.seRadioLabel').attr('role', 'radio');        
	});

})();