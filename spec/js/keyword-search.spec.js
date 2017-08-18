/* eslint-disable no-undef */

describe('keywordSearch', function keywordSearch() {
	beforeEach(function beforeEachKeywordSearch(done) {
		baltimoreCounty.keywordSearch.init(function initDone() {
			done();
		});
	});

	describe('search', function search() {
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

	describe('orderByNameThenPopularity', function orderByNameThenPopularity() {
		var allMatches;

		beforeEach(function beforeEach() {
			allMatches = [{ Term: 'aba' }, { Term: 'aaa' }, { Term: 'abc' }, { Term: 'bca' }, { Term: 'bac' }];
		});

		it('orders the results by term first', function ordering() {
			var actual = baltimoreCounty.keywordSearch.orderByNameThenPopularity('aa', allMatches);
			expect(actual[0].Term).toBe('aaa');
		});

		it('orders the results by rank second', function ordering() {
			var actual = baltimoreCounty.keywordSearch.orderByNameThenPopularity('aa', allMatches);
			expect(actual[1].Term).toBe('aba');
		});
	});
});
