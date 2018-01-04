let assert     = require('chai').assert
let clickshare = require('../clickshare');

describe('Discovery', function() {
  describe('#start()', function() {
    it('should discover the clickshare service', function(done) {
      this.timeout(20000);
      clickshare.discovery.on('up', function(ip) {
        console.log('we found a ClickShare Base Unit at ip: '+ip);
        clickshare.discovery.destroy();
        done();
      });
      clickshare.discovery.start();
    });
  });
});
