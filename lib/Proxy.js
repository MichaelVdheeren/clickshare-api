;(function() {
  const _       = require('lodash');
  const connect = require('connect');
  const httpProxy = require('http-proxy');

  const Proxy = function(ip, port, username, password) {
    this.ip = ip;
    this.port = port;
    this.username = _.isUndefined(username) ? 'integrator' : username;
    this.password = _.isUndefined(username) ? 'integrator' : password;

    this._proxy = httpProxy.createProxyServer({
      target: this.host + ':4001',
      secure: false,
      auth: this.username+ ':' +this.password,
      protocolRewrite: 'https'
    });

    this._server = connect();

    this._server.use(function(req, res, next) {
      if (req.headers['origin']) {
        res.setHeader('Access-Control-Allow-Origin', req.headers['origin']);
        res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
        res.setHeader('Access-Control-Max-Age', '3600');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type');
      }
      if (req.method !== 'OPTIONS') {
        next();
      } else {
        res.end();
      }
    });

    this._server.use(function(req, res) {
      this._proxy.web(req, res);
    }.bind(this));

    this.start = function() {
      this._server.listen(this.port);
    }

    this.stop = function() {
      this._server.close();
    }
  }

  module.exports = Proxy;
}());
