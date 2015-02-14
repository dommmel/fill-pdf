var assert    = require('assert'),
    temporary = require('temporary'),
    spawn     = require('child_process').spawnSync,
    exec      = require('child_process').exec,
    fillPdf   = require('../index.js'),
    fs        = require('fs');

var dir = new temporary.Dir();

describe('pdftk', function() {
  it('should exist', function() {
    var pdftk = spawn('pdftk', ['--version']);
    assert.equal(typeof pdftk.error, 'undefined', 'pdftk is not installed, fill-pdf requires pdftk to be installed and added to your PATH');
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
    it('should accept test/resources/test.pdf', function(done) {

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

      fillPdf.generatePdf(formData, '/test/resources/test.pdf', function(tempFile) {
        // Enable line below if you want to visual verify fill
        //exec('open ' + tempFile, function() { fs.unlink(tempFile)});
        fs.unlink(tempFile);
        done();
      });
    });

    // TODO: Do PDF parsing to verify fill worked
  });
});

