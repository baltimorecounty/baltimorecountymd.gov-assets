/* eslint-disable no-undef */

describe('KeywordSearch', function KeywordSearch() {
	describe('search', function init() {
		it('suggests searches when provided a keyword', function loadsData(done) {
			baltimoreCounty.keywordSearch.init(function callback() {
				var actual = baltimoreCounty.keywordSearch.search('jobs');
				expect(actual.length).toBeGreaterThan(1);
				done();
			});
		});

		it('suggests nothing when provided nothing', function loadsData(done) {
			baltimoreCounty.keywordSearch.init(function callback() {
				var actual = baltimoreCounty.keywordSearch.search('');
				expect(actual.length).toBe(0);
				done();
			});
		});

		it('suggests nothing when provided one character of whitespace', function loadsData(done) {
			baltimoreCounty.keywordSearch.init(function callback() {
				var actual = baltimoreCounty.keywordSearch.search(' ');
				expect(actual.length).toBe(0);
				done();
			});
		});

		it('suggests nothing when provided multiple characters of whitespace', function loadsData(done) {
			baltimoreCounty.keywordSearch.init(function callback() {
				var actual = baltimoreCounty.keywordSearch.search('      ');
				expect(actual.length).toBe(0);
				done();
			});
		});
	});
});
