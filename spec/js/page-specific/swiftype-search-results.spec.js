describe('Swiftype search results', function swiftypeSearchResultsTests() {
	var ns = baltimoreCounty.pageSpecific.swiftypeSearchResults;

	describe('calculateLastResultNumber', function calculateLastResultNumber() {
		it('should calculate the last result number for a single page of results', function tests() {
			var info = {
				current_page: 1,
				per_page: 10,
				total_result_count: 9
			};

			var actual = ns.calculateLastResultNumber(info);

			expect(actual).toBe(9);
		});

		it('should calculate the last result number for a middle page of results', function tests() {
			var info = {
				current_page: 5,
				per_page: 10,
				total_result_count: 100
			};

			var actual = ns.calculateLastResultNumber(info);

			expect(actual).toBe(50);
		});

		it('should calculate the last result number for a final page of results', function tests() {
			var info = {
				current_page: 10,
				per_page: 10,
				total_result_count: 100
			};

			var actual = ns.calculateLastResultNumber(info);

			expect(actual).toBe(100);
		});
	});

	describe('calculateFirstResultNumber', function calculateLastResultNumber() {
		it('should calculate the first result number for a single page of results', function tests() {
			var info = {
				current_page: 1,
				per_page: 10,
				total_result_count: 9
			};

			var actual = ns.calculateFirstResultNumber(info);

			expect(actual).toBe(1);
		});

		it('should calculate the first result number for a middle page of results', function tests() {
			var info = {
				current_page: 5,
				per_page: 10,
				total_result_count: 100
			};

			var actual = ns.calculateFirstResultNumber(info);

			expect(actual).toBe(41);
		});

		it('should calculate the first result number for a final page of results', function tests() {
			var info = {
				current_page: 10,
				per_page: 10,
				total_result_count: 100
			};

			var actual = ns.calculateFirstResultNumber(info);

			expect(actual).toBe(91);
		});
	});

	describe('buildPageLinks', function buildPageLinks() {
		it('should arrayify a page range', function tests() {
			var actual = ns.buildPageLinks(5, 1);

			expect(actual.length).toBe(5);
		});

		it('should indicate the current page is the first page', function tests() {			
			var actual = ns.buildPageLinks(5, 1);

			expect(actual[0].current).toBeTruthy();
		});

		it('should indicate the current page is a middle page', function tests() {			
			var actual = ns.buildPageLinks(5, 2);

			expect(actual[1].current).toBeTruthy();
		});

		it('should indicate the current page is the last page', function tests() {			
			var actual = ns.buildPageLinks(5, 5);

			expect(actual[4].current).toBeTruthy();
		});
	});
});
