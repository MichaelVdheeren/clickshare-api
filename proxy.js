var proxyOptions = {
	host: 'https://192.168.0.114',
	port: 4001
};

var connect = require('connect'),
  httpProxy = require('http-proxy');

var app = connect();

var proxy = httpProxy.createProxyServer({
  target: proxyOptions.host + ':' + proxyOptions.port,
  secure: false,
  auth: 'integrator:integrator',
  protocolRewrite: 'https'
});

proxy.on('error', function(e) {
  console.log(e);
});

app.use(function(req, res, next) {
  if (req.headers['origin']) {
    res.setHeader('Access-Control-Allow-Origin', req.headers['origin']);
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
    res.setHeader('Access-Control-Max-Age', '3600');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type');
  }
  if (req.method !== 'OPTIONS') {
    next();
  }
  else {
    res.end();
  }
});

app.use(function(req, res) {
  proxy.web(req, res);
});

app.listen('4001');
console.log('Proxy server started.')
