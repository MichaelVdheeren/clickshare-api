;(function() {
  'use strict'

  const _       = require('lodash');
  const util    = require("util");
  const bonjour = require('bonjour')();
  const SSDP    = require('node-ssdp').Client;
  const ssdp    = new SSDP({log: false});
  const EventEmitter = require('events').EventEmitter;

  function Discovery() {
    this._gcBrowser;
    this._apBrowser;
    this._moBrowser;

    this._addToRegistry = function(ip) {
      if (_.isUndefined(_.find(this._registry, ip))) {
        this._registry.push(ip);
        this.emit('up', ip);
      }
    }

    this._removeFromRegistry = function(ip) {
      let index = this._registry.indexOf(ip);
      if (index >= 0) {
        this._registry.splice(index, 1);
        this.emit('down', ip);
      }
    }

    this._serviceUp = function(service) {
      if (this._isClickShareService(service)) {
        this._addToRegistry(service.referer.address);
      }
    }

    this._serviceDown = function(service) {
      if (this._isClickShareService(service)) {
        this._removeFromRegistry(service.referer.address);
      }
    }

    this._isClickShareService = function(service) {
      if (service.txt.md = 'Cast Receiver') {
        let mac = service.txt.id;
        if (_.startsWith(mac, '0004A5')){
          return true;
        }
      } else if (service.type = 'airplay') {
        let mac = service.txt.deviceid;
        if (_.startsWith(mac, '00:04:A5')){
          return true;
        }
      } else if (service.type = 'mirrorop2s') {
        let product = service.txt.prodrange;
        if (_.startsWith(product, 'ClickShare')){
          return true;
        }
      }

      return false;
    }

    this._registry = [];
  }

  Discovery.prototype.start = function (opts, onup) {
    // browse for all http services from a ClickShare
    this._gcBrowser = bonjour.find({type:'googlecast'});
    this._apBrowser = bonjour.find({type:'airplay'});
    this._moBrowser = bonjour.find({type:'mirrorop2s'});

    ssdp.on('response', function (headers, statusCode, rinfo) {
      this._addToRegistry(rinfo.address);
    });

    this._gcBrowser.on('up', this._serviceUp.bind(this));
    this._gcBrowser.on('down', this._serviceDown.bind(this));
    this._apBrowser.on('up', this._serviceUp.bind(this));
    this._apBrowser.on('down', this._serviceDown.bind(this));
    this._moBrowser.on('up', this._serviceUp.bind(this));
    this._moBrowser.on('down', this._serviceDown.bind(this));

    // look for chromecast like messages from the ClickShare
    ssdp.search('urn:dial-multiscreen-org:service:dial:1');
  }

  Discovery.prototype.stop = function() {
    // advertise shutting down and stop listening
    this._gcBrowser.stop();
    this._apBrowser.stop();
    this._moBrowser.stop();
    ssdp.stop();
  }

  Discovery.prototype.destroy = function () {
    this.stop();
    bonjour.destroy();
  }

  util.inherits(Discovery, EventEmitter);

  module.exports = new Discovery();
}());
