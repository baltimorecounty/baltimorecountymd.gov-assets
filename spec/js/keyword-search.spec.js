/* eslint-disable no-undef */

describe('KeywordSearch', function KeywordSearch() {

	beforeEach(function beforeEach(done) {
		baltimoreCounty.keywordSearch.init(function initDone() {
			done();
		});
	});

	describe('search', function init() {
		it('suggests searches when provided a keyword', function loadsData() {
			var actual = baltimoreCounty.keywordSearch.search('jobs');
			expect(actual.length).toBeGreaterThan(1);
		});

		it('suggests nothing when provided nothing', function loadsData() {
			var actual = baltimoreCounty.keywordSearch.search('');
			expect(actual.length).toBe(0);
		});

		it('suggests nothing when provided one character of whitespace', function loadsData() {
			var actual = baltimoreCounty.keywordSearch.search(' ');
			expect(actual.length).toBe(0);
		});

		it('suggests nothing when provided multiple characters of whitespace', function loadsData() {
			var actual = baltimoreCounty.keywordSearch.search('      ');
			expect(actual.length).toBe(0);
		});
	});
});
