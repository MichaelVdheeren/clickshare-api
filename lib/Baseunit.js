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
    _super = this;
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
        return this._get.call(this,resource);
      } else {
        return this._set.call(this,resource,value);
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
      return _super._property.call(_super,'Buttons/ButtonTable');
    }

    this.audio = {
      enabled: function(value) {
        return _super._property.call(_super,'Audio/Enabled', value);
      },
      output: function(value) {
        return _super._property.call(_super,'Audio/Output', value);
      }
    }

    this.deviceInfo = {
      articleNumber: function() {
        return _super._property.call(_super,'DeviceInfo/ArticleNumber');
      },
      currentUptime: function() {
        return _super._property.call(_super,'DeviceInfo/CurrentUptime');
      },
      firstUsed: function() {
        return _super._property.call(_super,'DeviceInfo/FirstUsed');
      },
      inUse: function() {
        return _super._property.call(_super,'DeviceInfo/InUse');
      },
      lastUsed: function() {
        return _super._property.call(_super,'DeviceInfo/LastUsed');
      },
      modelName: function() {
        return _super._property.call(_super,'DeviceInfo/ModelName');
      },
      processes: function() {
        return _super._property.call(_super,'DeviceInfo/Processes/ProcessTable');
      },
      sensors: function() {
        return _super._property.call(_super,'DeviceInfo/Sensors');
      },
      serialNumber: function() {
        return _super._property.call(_super,'DeviceInfo/SerialNumber');
      },
      sharing: function() {
        return _super._property.call(_super,'DeviceInfo/Sharing');
      },
      status: function() {
        return _super._property.call(_super,'DeviceInfo/Status');
      },
      statusMessage: function() {
        return _super._property.call(_super,'DeviceInfo/StatusMessage');
      },
      totalUptime: function() {
        return _super._property.call(_super,'DeviceInfo/TotalUptime');
      },
    }

    this.display = {
      outputs: function() {
        return _super._property.call(_super,'Display/OutputTable');
      },
      showWallpaper: function(value) {
        return _super._property.call(_super,'Display/ShowWallpaper', value);
      }
    }

    this.inputs =  function() {
      return _super._property.call(_super,'InputCard/InputTable');
    }
  }

  module.exports = Baseunit
}());
