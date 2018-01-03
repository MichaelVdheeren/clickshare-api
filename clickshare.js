;(function() {
  const _       = require('lodash');
  const request = require('request-promise');
  const humps   = require('lodash-humps');

  function __get__(resource) {
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
  function __set__(resource, value) {
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

  function __property__(resource, value) {
    if (_.isUndefined(value)) {
      return __get__.call(this,resource);
    } else {
      return __set__.call(this,resource,value);
    }
  }

  /**
   * Represents a ClickShare Base Unit
   * @constructor
   * @param {string} ip - The ip address of the Base Unit.
   * @param {string} username - The api username of the Base Unit. Defaults to integrator.
   * @param {string} password - The api password of the Base Unit. Defaults to integrator.
   * @param {string} api_version - The api version to use.
   */

  function Parameter() {

  }

  function Baseunit(ip, username, password, api_version) {
    __super__ = this;
    this.ip       = ip;
    this.port     = 4001;
    this.username = _.isUndefined(username) ? 'integrator' : username,
    this.password = _.isUndefined(password) ? 'integrator' : password,
    this.api_version = _.isUndefined(api_version) ? 'v1.8' : api_version,

    /**
     * General getter
     * @private
     */


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
      return __property__.call(__super__,'Buttons/ButtonTable');
    }

    this.audio = {
      enabled: function(value) {
        return __property__.call(__super__,'Audio/Enabled', value);
      },
      output: function(value) {
        return __property__.call(__super__,'Audio/Output', value);
      }
    }

    this.deviceInfo = {
      articleNumber: function() {
        return __property__.call(__super__,'DeviceInfo/ArticleNumber');
      },
      currentUptime: function() {
        return __property__.call(__super__,'DeviceInfo/CurrentUptime');
      },
      firstUsed: function() {
        return __property__.call(__super__,'DeviceInfo/FirstUsed');
      },
      inUse: function() {
        return __property__.call(__super__,'DeviceInfo/InUse');
      },
      lastUsed: function() {
        return __property__.call(__super__,'DeviceInfo/LastUsed');
      },
      modelName: function() {
        return __property__.call(__super__,'DeviceInfo/ModelName');
      },
      processes: function() {
        return __property__.call(__super__,'DeviceInfo/Processes/ProcessTable');
      },
      sensors: function() {
        return __property__.call(__super__,'DeviceInfo/Sensors');
      },
      serialNumber: function() {
        return __property__.call(__super__,'DeviceInfo/SerialNumber');
      },
      sharing: function() {
        return __property__.call(__super__,'DeviceInfo/Sharing');
      },
      status: function() {
        return __property__.call(__super__,'DeviceInfo/Status');
      },
      statusMessage: function() {
        return __property__.call(__super__,'DeviceInfo/StatusMessage');
      },
      totalUptime: function() {
        return __property__.call(__super__,'DeviceInfo/TotalUptime');
      },
    }

    this.display = {
      outputs: function() {
        return __property__.call(__super__,'Display/OutputTable');
      },
      showWallpaper: function(value) {
        return __property__.call(__super__,'Display/ShowWallpaper', value);
      }
    }

    this.inputs =  function() {
      return __property__.call(__super__,'InputCard/InputTable');
    }
  }

  module.exports = Baseunit
}());
