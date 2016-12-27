describe('Spay/neuter calculator', function() {

	describe('determineCost', function() {
		
		it('returns undefined when formData is undefined', function() {
			expect(typeof baltimoreCounty.calculators.spayNeuter.determineCost()).toBe('undefined');
		});

		it('returns undefined when no resident/assistance/cat or pitbull/ZIP match', function() {
			var formData = { isResident: false, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };
			expect(typeof baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, false)).toBe('undefined');
		});

		it('returns undefined when assistance, but no resident/cat or pitbull/ZIP match', function() {
			var formData = { isResident: false, isPublicAssistance: true, isCatPitBull: false, zipCode: '00000' };
			expect(typeof baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, false)).toBe('undefined');
		});

		it('returns undefined when cat or pitbull, but no resident/assistance/ZIP match', function() {
			var formData = { isResident: false, isPublicAssistance: false, isCatPitBull: true, zipCode: '00000' };
			expect(typeof baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, false)).toBe('undefined');
		});

		it('returns undefined when Dundalk ZIP match, but no resident/assistance/cat or pitbull', function() {
			var formData = { isResident: false, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };
			expect(typeof baltimoreCounty.calculators.spayNeuter.determineCost(formData, true, false)).toBe('undefined');
		});

		it('returns undefined when Swap ZIP match, but no resident/assistance/cat or pitbull', function() {
			var formData = { isResident: false, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };
			expect(typeof baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, true)).toBe('undefined');
		});

		it('returns 20 when resident, but no assistance/cat or pitbull/ZIP match', function() {
			var formData = { isResident: true, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };
			expect(baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, false)).toBe(20);
		});

		it('returns 20 when resident/assistance, but no cat or pitbull/ZIP match', function() {
			var formData = { isResident: true, isPublicAssistance: true, isCatPitBull: false, zipCode: '00000' };
			expect(baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, false)).toBe(20);
		});

		it('returns 20 when resident/cat or pitbull, but no assistance/ZIP match', function() {
			var formData = { isResident: true, isPublicAssistance: false, isCatPitBull: true, zipCode: '00000' };
			expect(baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, false)).toBe(20);
		});

		it('returns 0 when resident/Dundalk ZIP match, but no assistance/cat or pitbull', function() {
			var formData = { isResident: true, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };
			expect(baltimoreCounty.calculators.spayNeuter.determineCost(formData, true, false)).toBe(0);
		});

		it('returns 0 when resident/Swap ZIP match, but no assistance/cat or pitbull', function() {
			var formData = { isResident: true, isPublicAssistance: false, isCatPitBull: false, zipCode: '00000' };
			expect(baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, true)).toBe(0);
		});

		it('returns 0 when resident/assistance/cat or pitbull, but no ZIP match', function() {
			var formData = { isResident: true, isPublicAssistance: true, isCatPitBull: true, zipCode: '00000' };
			expect(baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, false)).toBe(0);
		});

		it('returns 0 when resident/assistance/cat or pitbull/ZIP match', function() {
			var formData = { isResident: true, isPublicAssistance: true, isCatPitBull: true, zipCode: '00000' };
			expect(baltimoreCounty.calculators.spayNeuter.determineCost(formData, false, false)).toBe(0);
		});

	});

	describe('facilityPicker', function() {

		var allLocationCount;

		beforeAll(function() {
			allLocationCount = 3;
		});

		it('returns all locations when cost is 20 without public assistance', function() {
			expect(baltimoreCounty.calculators.spayNeuter.facilityPicker(20, false, false, false).length).toBe(allLocationCount);
		});

		it('returns all locations when cost is 20 with public assistance', function() {
			expect(baltimoreCounty.calculators.spayNeuter.facilityPicker(20, true, false, false).length).toBe(allLocationCount);
		});

		it('returns no locations when cost is 0 with no public assistance', function() {
			expect(baltimoreCounty.calculators.spayNeuter.facilityPicker(0, false, false, false).length).toBe(0);
		});

		it('returns all locations when cost is 0 with public assistance', function() {
			expect(baltimoreCounty.calculators.spayNeuter.facilityPicker(0, true, false, false).length).toBe(allLocationCount);
		});

		it('returns one location when ZIP code is in first set ', function() {
			expect(baltimoreCounty.calculators.spayNeuter.facilityPicker(0, false, true, false).length).toBe(1);
		});

		it('returns one location when ZIP code is in second set', function() {
			expect(baltimoreCounty.calculators.spayNeuter.facilityPicker(0, false, false, true).length).toBe(1);
		});

		it('returns one location when ZIP code is in first set with public assistance', function() {
			expect(baltimoreCounty.calculators.spayNeuter.facilityPicker(0, true, true, false).length).toBe(1);
		});

		it('returns one location when ZIP code is in second setwith public assistance', function() {
			expect(baltimoreCounty.calculators.spayNeuter.facilityPicker(0, true, false, true).length).toBe(1);
		});

	});

	describe('buildDiscountMessageHTML', function() {

		it('returns an "ineligible" message when cost is undefined', function() {
			expect(baltimoreCounty.calculators.spayNeuter.buildDiscountMessageHTML([], undefined)).toContain('We\'re sorry');
		});

		it('returns a "Congratulations" message when cost is 0', function() {
			expect(baltimoreCounty.calculators.spayNeuter.buildDiscountMessageHTML([], 0)).toContain('Good news');
		});

		it('returns a "Congratulations" message when cost is 20', function() {
			expect(baltimoreCounty.calculators.spayNeuter.buildDiscountMessageHTML([], 20)).toContain('Good news');
		});

	});

});