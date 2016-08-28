var assert    = require('assert'),
    temporary = require('temporary'),
    exec      = require('child_process').exec,
    fillPdf   = require('../index.js'),
    fs        = require('fs'),
    path      = require('path');

var dir = new temporary.Dir();

describe('pdftk', function() {
  it('should exist', function(done) {
    var pdftk = exec('pdftk', ['--version'], function(err, stdout, stderr) {
      assert(!err && !stderr, 'pdftk is not installed, fill-pdf requires pdftk to be installed and added to your PATH');
      done(err);
    });;
  });
});

describe('fill-pdf instantiation', function() {
  it('should be an object', function() {
    assert.equal(typeof fillPdf, 'object');
  });
  it('should have method: generateFdf', function() {
    assert.equal(typeof fillPdf.generateFdf, 'function');
  });
  it('should have method: generatePdf', function() {
    assert.equal(typeof fillPdf.generatePdf, 'function');
  });
});

describe('Temp File Generation', function() {
  it('should generate tmp directory object', function() {
    assert.equal(typeof dir, 'object', true);
  });
});

describe('fill-pdf', function() {
  describe('#generatePdf()', function() {

    var formData = {
      Name_Last: 'Doe',
      Name_First: 'John',
      Name_Middle: 'Francis',
      Telephone_Home: 1112223333,
      Sex: 'MALE',
      Address_2: '1234 Some Rd',
      City: 'Annapolis',
      STATE: 'MD',
      ZIP: 22334,
      PHD: 'Yes',
      TRADE_CERTIFICATE: 'Yes'
    }

    it('should accept test/resources/test.pdf', function(done) {

      fillPdf.generatePdf(formData, 'test/resources/test.pdf', function(err, pdf) {
        // Uncomment if you want to open the file to view
        /*
        fs.writeFileSync('test-result.pdf', pdf);
        exec('open test-result.pdf');
        */
        assert(pdf);
        done(err);
      });
    });

    it('should accept an absolute path as a file location', function(done) {
      fillPdf.generatePdf(formData, path.resolve(__dirname + '/resources/test.pdf'), function(err, pdf) {
        assert(pdf);
        done(err);
      });
    });

    it('should accept additional arguments', function(done) {
        fillPdf.generatePdf(formData, 'test/resources/test.pdf', ["flatten"], function(err, pdf) {
          assert(pdf);
          done(err);
        });
    });

    // TODO: Do PDF parsing to verify fill worked
  });

  describe('#generateFdf()', function() {

    var formData = {
      Name_Last: 'Doe',
      Name_First: 'John',
      Name_Middle: 'Francis',
      Telephone_Home: 1112223333,
      Sex: 'MALE',
      Address_2: '1234 Some Rd',
      City: 'Annapolis',
      STATE: 'MD',
      ZIP: 22334,
      PHD: 'Yes',
      TRADE_CERTIFICATE: 'Yes',
      Price: '£10.50'
    };

    it('should generate valid data', function() {
      var actual = fillPdf.generateFdf(formData);
      var expected = fs.readFileSync('test/resources/test.fdf', 'utf8');
      assert.equal(actual, expected);
    });

  });
});
