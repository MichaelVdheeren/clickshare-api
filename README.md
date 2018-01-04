# ClickShare API wrapper
An unofficial NodeJS wrapper library for the ClickShare Base Unit API

## Installation

Using npm:
```shell
$ npm i --save clickshare-api
```

In Node.js:
```js
const clickshare = require('clickshare-api');
// Load the constructor to create multiple base units.

const Baseunit = clickshare.Baseunit;
let baseunitOne = new Baseunit('127.0.0.1');

// Search for different Base Units - discovery is a singleton.
const discovery = clickshare.discovery;
discovery.on('up', function(ip) {
  console.log('found a ClickShare on ip: '+ip);
});
discovery.start();
```
