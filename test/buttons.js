let assert     = require('chai').assert
let Baseunit   = require('../clickshare');
let baseunitip = require('./baseunit').ip;

describe('Baseunit', function() {
  describe('#buttons()', function() {
    it('should return the Buttons paired to the Base Unit', function(done) {
      let baseunit = new Baseunit(baseunitip);
      baseunit.buttons().then(function(value) {
        assert.isAtLeast(value.length,1);
        done();
      });
    });
  });
});
