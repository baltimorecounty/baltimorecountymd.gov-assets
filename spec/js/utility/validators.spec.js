describe('Phone Number Validator', function (done) {
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

  //valid formats
      /**
      	(123)456-7890
      	(123) 456-7890
        123-456-7890
        123.456.7890
        1234567890
        +31636363634
        075-63546725
      */


  it('should be valid if the given format is (xxx)xxx-xxxx', function (done) {
    var input = "(911)911-4545";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(true);

    done();
  });

  it('should be valid if the given format is (xxx) xxx-xxxx', function (done) {
    var input = "(911) 911-4545";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(true);

    done();
  });

  it('should be valid if the given format is xxx-xxx-xxxx', function (done) {
    var input = "123-456-7890";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(true);

    done();
  });

  it('should be valid if the given format is xxx.xxx.xxxx', function (done) {
    var input = "123.456.7890";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(true);

    done();
  });

  it('should be valid if the given format is xxxxxxxxxx', function (done) {
    var input = "1234567890";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(true);

    done();
  });

  it('should be valid if the given format is xxxxxxxxxx', function (done) {
    var input = 1234567890;
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(true);

    done();
  });

  /* it('should be valid if the given format is xxxxxxxxxxx', function (done) {
    var input = "11234567890";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(true);

    done();
  }); */

  it('should be valid if the given format is +xxxxxxxxxx', function (done) {
    var input = "+31636363634";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(false);

    done();
  });

  it('should be valid if the given format is xxx-xxxxxxxx', function (done) {
    var input = "075-63546725";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(false);

    done();
  });

  it('should be invalid if the given format is xxx-xxx-xxx', function (done) {
    var input = "222-222-222";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(false);

    done();
  });

  it('should be invalid if the given format is xxx-xx-xxx', function (done) {
    var input = "222-22-222";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(false);

    done();
  });

  it('should be invalid if the given format is xx-xx-xxx', function (done) {
    var input = "22-22-222";
    var actual = baltimoreCounty.utility.validate('phoneNumber', input);

    expect(actual).to.eql(false);

    done();
  });
});