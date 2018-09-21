/* exported defaults */

/* Magic Mirror
 * Config Defauls
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var port = 8080;
var address = 'localhost';
if (typeof mmPort !== 'undefined') {
  port = mmPort;
}
var defaults = {
  address: address,
  port: port,
  kioskmode: false,
  electronOptions: {},
  ipWhitelist: ['127.0.0.1', '::ffff:127.0.0.1', '::1'],

  language: 'en',
  timeFormat: 24,
  units: 'metric',
  zoom: 1,
  customCss: 'css/custom.css',

  modules: [],

  paths: {
    modules: 'modules',
    vendor: 'vendor',
  },
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {
  module.exports = defaults;
}
