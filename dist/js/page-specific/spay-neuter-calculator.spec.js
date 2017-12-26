/* eslint-disable */
describe('Spay/neuter calculator', function () {
	describe('determineCost', function () {
		it('returns undefined when formData is undefined', function () {
			var actual = typeof baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost();

			expect(actual).toBe('undefined');
		});

		it('returns undefined when no resident/assistance/cat or pitbull/ZIP match', function () {
			var formData = { isResident: false, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };

			var actual = typeof baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false);

			expect(actual).toBe('undefined');
		});

		it('returns undefined when assistance, but no resident/cat or pitbull/ZIP match', function () {
			var formData = { isResident: false, isPublicAssistance: true, isCatPitBull: false, zipCode: '00000' };

			var actual = typeof baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false);

			expect(actual).toBe('undefined');
		});

		it('returns undefined when cat or pitbull, but no resident/assistance/ZIP match', function () {
			var formData = { isResident: false, isPublicAssistance: false, isCatPitBull: true, zipCode: '00000' };

			var actual = typeof baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false);

			expect(actual).toBe('undefined');
		});

		it('returns undefined when Dundalk ZIP match, but no resident/assistance/cat or pitbull', function () {
			var formData = { isResident: false, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };

			var actual = typeof baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, true, false);

			expect(actual).toBe('undefined');
		});

		it('returns undefined when Swap ZIP match, but no resident/assistance/cat or pitbull', function () {
			var formData = { isResident: false, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };

			var actual = typeof baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, true);

			expect(actual).toBe('undefined');
		});

		it('returns 20 when resident, but no assistance/cat or pitbull/ZIP match', function () {
			var formData = { isResident: true, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };

			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false);

			expect(actual).toBe(20);
		});

		it('returns 20 when resident/assistance, but no cat or pitbull/ZIP match', function () {
			var formData = { isResident: true, isPublicAssistance: true, isCatPitBull: false, zipCode: '00000' };

			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false);

			expect(actual).toBe(20);
		});

		it('returns 20 when resident/cat or pitbull, but no assistance/ZIP match', function () {
			var formData = { isResident: true, isPublicAssistance: false, isCatPitBull: true, zipCode: '00000' };

			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false);

			expect(actual).toBe(20);
		});

		it('returns 0 when resident/Dundalk ZIP match, but no assistance/cat or pitbull', function () {
			var formData = { isResident: true, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };

			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, true, false);

			expect(actual).toBe(0);
		});

		it('returns 0 when resident/Swap ZIP match, but no assistance/cat or pitbull', function () {
			var formData = { isResident: true, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };

			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, true);

			expect(actual).toBe(0);
		});

		it('returns 0 when resident/assistance/cat or pitbull, but no ZIP match', function () {
			var formData = { isResident: true, isPublicAssistance: true, isCatPitBull: true, zipCode: '00000' };

			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false);

			expect(actual).toBe(0);
		});

		it('returns 0 when resident/assistance/cat or pitbull/ZIP match', function () {
			var formData = { isResident: true, isPublicAssistance: true, isCatPitBull: true, zipCode: '00000' };

			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false);

			expect(actual).toBe(0);
		});

		it('returns 0 when resident/no assistance/is for a cat/ZIP match', function () {
			var formData = { isResident: true, isPublicAssistance: false, isForCat: true, zipCode: '21227' };

			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false, true);

			expect(actual).toBe(0);
		});

		it('returns 20 when resident/no assistance/is not for a cat/ZIP match', function () {
			var formData = { isResident: true, isPublicAssistance: false, isForCat: false, zipCode: '21227' };

			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.determineCost(formData, false, false, false);

			expect(actual).toBe(20);
		});
	});

	describe('facilityPicker', function () {
		var allLocationCount;

		beforeAll(function () {
			allLocationCount = 3;
		});

		it('returns all locations when cost is 20 without public assistance', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.facilityPicker(20, false, false, false).length;

			expect(actual).toBe(allLocationCount);
		});

		it('returns all locations when cost is 20 with public assistance', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.facilityPicker(20, true, false, false).length;

			expect(actual).toBe(allLocationCount);
		});

		it('returns no locations when cost is 0 with no public assistance', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.facilityPicker(0, false, false, false).length;

			expect(actual).toBe(0);
		});

		it('returns all locations when cost is 0 with public assistance', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.facilityPicker(0, true, false, false).length;

			expect(actual).toBe(allLocationCount);
		});

		it('returns one location when ZIP code is in first set ', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.facilityPicker(0, false, true, false).length;

			expect(actual).toBe(1);
		});

		it('returns one location when ZIP code is in second set', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.facilityPicker(0, false, false, true).length;

			expect(actual).toBe(1);
		});

		it('returns one location when ZIP code is in first set with public assistance', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.facilityPicker(0, true, true, false).length;

			expect(actual).toBe(1);
		});

		it('returns one location when ZIP code is in second setwith public assistance', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.facilityPicker(0, true, false, true).length;

			expect(actual).toBe(1);
		});
	});

	describe('buildDiscountMessageHTML', function () {
		it('returns an "We\'re sorry" message when cost is undefined', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.buildDiscountMessageHTML([], undefined);

			expect(actual).toContain('We\'re sorry');
		});

		it('returns a "Good news" message when cost is 0', function () {
			var actual = baltimoreCounty.pageSpecific.spayNeuterCalculator.buildDiscountMessageHTML([], 0);

			expect(actual).toContain('Good news');
		});

		it('returns a "Good news" message when cost is 20', function () {
			var acutal = baltimoreCounty.pageSpecific.spayNeuterCalculator.buildDiscountMessageHTML([], 20);

			expect(acutal).toContain('Good news');
		});
	});
});
