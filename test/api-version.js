let assert     = require('chai').assert
let Baseunit   = require('../clickshare');
let baseunitip = require('./baseunit').ip;

describe('Baseunit', function() {
  describe('#supportedVersions()', function() {
    it('should return the supported versions of the Base Unit api', function(done) {
      let baseunit = new Baseunit(baseunitip);
      baseunit.supportedVersions().then(function(value) {
        assert.include(value,'v1.8');
        done();
      });
    });
  });
});

describe('Baseunit', function() {
  describe('#latestSupportedVersion()', function() {
    it('should return the latest supported version of the Base Unit api', function(done) {
      let baseunit = new Baseunit(baseunitip);
      baseunit.latestSupportedVersion().then(function(value) {
        assert.equal(value,'v1.8');
        done();
      });
    });
  });
});
