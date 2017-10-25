namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.binarySearch = (function binarySearchClosure() {
	'use strict';

	var binarySearch = function binarySearch(list, item) {
		var min = 0;
		var max = list.length - 1;
		var guess;

		while (min <= max) {
			guess = Math.floor((min + max) / 2);

			if (list[guess] === item) {
				return guess;
			}

			if (list[guess] < item) {
				min = guess + 1;
			} else {
				max = guess - 1;
			}
		}

		return -1;
	};

	return {
		binarySearch: binarySearch
	};
}());
