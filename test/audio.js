let assert     = require('chai').assert
let clickshare = require('../clickshare');
let baseunitip = require('./baseunit').ip;

describe('Baseunit', function() {
  describe('audio', function() {
    describe('#enabled()', function() {
      this.timeout(5000);
      it('should be able to disabled and enable the audio', function(done) {
        let baseunit = new clickshare.Baseunit(baseunitip);
        baseunit.audio.enabled(false).then(function() {
          baseunit.audio.enabled().then(function(value) {
            assert.equal(value,false);
            done();
            baseunit.audio.enabled(true);
          });
        });
      });
    });
  });
});

describe('Baseunit', function() {
  describe('audio', function() {
    describe('#output()', function() {
      this.timeout(5000);
      it('should set be able to change the audio output', function(done) {
        let baseunit = new clickshare.Baseunit(baseunitip);
        baseunit.audio.output('Jack').then(function() {
          baseunit.audio.output().then(function(value) {
            assert.equal(value,'Jack');
            done();
            baseunit.audio.output('HDMI');
          });
        });
      });
    });
  });
});
