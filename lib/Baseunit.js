;(function() {
  const _       = require('lodash');
  const request = require('request-promise');
  const humps   = require('lodash-humps');

  /**
   * Represents a ClickShare Base Unit
   * @constructor
   * @param {string} ip - The ip address of the Base Unit.
   * @param {string} username - The api username of the Base Unit. Defaults to integrator.
   * @param {string} password - The api password of the Base Unit. Defaults to integrator.
   * @param {string} api_version - The api version to use.
   */
  function Baseunit(ip, username, password, api_version) {
    this.ip       = ip;
    this.port     = 4001;
    this.username = _.isUndefined(username) ? 'integrator' : username,
    this.password = _.isUndefined(password) ? 'integrator' : password,
    this.api_version = _.isUndefined(api_version) ? 'v1.8' : api_version,

    this._get = function(resource) {
      return request({
        uri: 'https://'+this.ip+':'+this.port+'/'+this.api_version+'/'+resource,
        method: 'GET',
        auth: {
          user: this.username,
          pass: this.password
        },
        json: true,
        rejectUnauthorized: false
      }).then(function(result) {
        let value = result.data.value;

        // Check if the top node has numeric keys, if so convert to Array
        if (_.every(_.keys(value),_.toNumber)) {
          value = _.toArray(value);
        }

        // Then make sure that all elements in the Array are camel case
        return humps(value);
      });
    }

    /**
     * General setter
     * @private
     */
    this._set = function(resource, value) {
      return request({
        uri: 'https://'+this.ip+':'+this.port+'/'+this.api_version+'/'+resource,
        method: 'PUT',
        body: {
          value: value
        },
        json: true,
        auth: {
          user: this.username,
          pass: this.password
        },
        rejectUnauthorized: false
      });
    }

    this._property = function(resource, value) {
      if (_.isUndefined(value)) {
        return this._get(resource);
      } else {
        return this._set(resource,value);
      }
    }

    /**
     * Retrieve the available API versions from the Base Unit
     */
    this.supportedVersions = function() {
      return request({
        uri: 'https://'+this.ip+':'+this.port+'/SupportedVersions',
        method: 'GET',
        'auth': {
          'user': this.username,
          'pass': this.password
        },
        json: true,
        rejectUnauthorized: false
      }).then(function(result) {
        return result.data.value;
      });
    },

    this.latestSupportedVersion = function() {
      return this.supportedVersions().then(function(value) {
        return _.last(value);
      });
    }

    this.buttons = function() {
      return this._property('Buttons/ButtonTable');
    }.bind(this)

    this.audio = {
      enabled: function(value) {
        return this._property('Audio/Enabled', value);
      }.bind(this),
      output: function(value) {
        return this._property('Audio/Output', value);
      }.bind(this)
    }

    this.deviceInfo = {
      articleNumber: function() {
        return this._property('DeviceInfo/ArticleNumber');
      }.bind(this),
      currentUptime: function() {
        return this._property('DeviceInfo/CurrentUptime');
      }.bind(this),
      firstUsed: function() {
        return this._property('DeviceInfo/FirstUsed');
      }.bind(this),
      inUse: function() {
        return this._property('DeviceInfo/InUse');
      }.bind(this),
      lastUsed: function() {
        return this._property('DeviceInfo/LastUsed');
      }.bind(this),
      modelName: function() {
        return this._property('DeviceInfo/ModelName');
      }.bind(this),
      processes: function() {
        return this._property('DeviceInfo/Processes/ProcessTable');
      }.bind(this),
      sensors: function() {
        return this._property('DeviceInfo/Sensors');
      }.bind(this),
      serialNumber: function() {
        return this._property('DeviceInfo/SerialNumber');
      }.bind(this),
      sharing: function() {
        return this._property('DeviceInfo/Sharing');
      }.bind(this),
      status: function() {
        return this._property('DeviceInfo/Status');
      }.bind(this),
      statusMessage: function() {
        return this._property('DeviceInfo/StatusMessage');
      }.bind(this),
      totalUptime: function() {
        return this._property('DeviceInfo/TotalUptime');
      }.bind(this),
    }

    this.display = {
      outputs: function() {
        return this._property('Display/OutputTable');
      }.bind(this),
      showWallpaper: function(value) {
        return this._property('Display/ShowWallpaper', value);
      }.bind(this)
    }

    this.inputs = function() {
      return this._property('InputCard/InputTable');
    }.bind(this)
  }

  module.exports = Baseunit
}());
