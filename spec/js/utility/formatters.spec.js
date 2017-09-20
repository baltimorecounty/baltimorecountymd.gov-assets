// var assert = require('chai').assert;
// var expect = require('chai').expect;
// var sinon = require('sinon');
// var formatter = require('../../../js/utility/formatters.js');

describe('Currency Formatter', function (done) {

    it('should convert a decimal to the currency as a string', function (done) {
        var input = 1000.57;
        var actual = baltimoreCounty.utility.format('currency', input);

        expect(actual).to.eql("$1,000.57");

        done();
    });

    it('should convert a decimal as string to the currency as a string', function (done) {
        var input = "1000.57";
        var actual = baltimoreCounty.utility.format('currency', input);

        expect(actual).to.eql("$1,000.57");

        done();
    });

    it('should convert a integer to the currency as a string', function (done) {
        var input = 1000;
        var actual = baltimoreCounty.utility.format('currency', input);

        expect(actual).to.eql("$1,000.00");

        done();
    });

    it('should convert a integer as string to the currency as a string', function (done) {
        var input = "1000";
        var actual = baltimoreCounty.utility.format('currency', input);

        expect(actual).to.eql("$1,000.00");

        done();
    });

    it('should properly round a decimal and convert the decimal to the currency as a string', function (done) {
        var input = 1000.57889;
        var actual = baltimoreCounty.utility.format('currency', input);

        expect(actual).to.eql("$1,000.58");

        done();
    });

    it('should properly round a decimal as a string and convert the decimal as a string to the currency as a string', function (done) {
        var input = "1000.57889";
        var actual = baltimoreCounty.utility.format('currency', input);

        expect(actual).to.eql("$1,000.58");

        done();
    });
});

describe('Phone Number Formatter', function (done) {
    var sandbox;

    beforeEach(function () {
        // create a sandbox
        sandbox = sinon.sandbox.create();

        // stub some console methods
        sandbox.stub(console, "error");
    });

    afterEach(function () {
        // restore the environment as it was before
        sandbox.restore();
    });


    it('should return the given format xxx-xxx-xxxx', function (done) {
        var input = "(911) 911-4545";
        var format = "xxx-xxx-xxxx";
        var actual = baltimoreCounty.utility.format('phoneNumber', input, format);

        expect(actual).to.eql("911-911-4545");

        done();
    });

    it('should return the given format (xxx) xxx-xxxx', function (done) {
        var input = "911-911-4545";
        var format = "(xxx) xxx-xxxx";
        var actual = baltimoreCounty.utility.format('phoneNumber', input, format);

        expect(actual).to.eql("(911) 911-4545");

        done();
    });

    it('should return the given format (xxx) xxx-xxxx with 1 prefix', function (done) {
        var input = "1-911-911-4545";
        var format = "(xxx) xxx-xxxx";
        var actual = baltimoreCounty.utility.format('phoneNumber', input, format);

        expect(actual).to.eql("(911) 911-4545");

        done();
    });

    it('should return the given format 1 (xxx) xxx-xxxx', function (done) {
        var input = "1-911-911-4545";
        var format = "x (xxx) xxx-xxxx";
        var actual = baltimoreCounty.utility.format('phoneNumber', input, format);

        expect(actual).to.eql("1 (911) 911-4545");

        done();
    });

    it('should return the given format (xxx) xxx-xxxx', function (done) {
        var input = 9119114545;
        var format = "(xxx) xxx-xxxx";
        var actual = baltimoreCounty.utility.format('phoneNumber', input, format);

        expect(actual).to.eql("(911) 911-4545");

        done();
    });

    it('should return the given format 1 (xxx) xxx-xxxx', function (done) {
        var input = 19119114545;
        var format = "x (xxx) xxx-xxxx";
        var actual = baltimoreCounty.utility.format('phoneNumber', input, format);

        expect(actual).to.eql("1 (911) 911-4545");

        done();
    });

    it('should return nothing when there it\'s not possible to format the number and log an error to the console', function (done) {
        var input = "91-911-4545";
        var format = "(xxx) xxx-xxxx";
        var actual = baltimoreCounty.utility.format('phoneNumber', input, format);
        //TODO: check if teh error is thrown to the console
        expect(actual).to.eql(null);
        sinon.assert.calledOnce(console.error);
        done();
    });

});