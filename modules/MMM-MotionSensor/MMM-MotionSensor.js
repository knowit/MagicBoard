/* global Module */

/* Motion Sensor
 * Module: MMM-MotionSensor
 *
 * 
 * MIT Licensed.
 */

Module.register('MMM-MotionSensor', {

  defaults: {},

  getStyles: function() {
    return ["motionsensor.css"];
  },

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.enableBlackScreen = false;
    this.updateDom();
    this.sendSocketNotification('START_MOTION_DETECTION', {});
  },


  // the socket handler
  socketNotificationReceived: function(notification, payload) {
    Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);

    if (notification === "MOTION_DETECTED" && this.enableBlackScreen) {
      this.enableBlackScreen = false;
      this.updateDom();
    } else if (notification === "NO_MOTION_DETECTED" && !this.enableBlackScreen) {
      this.enableBlackScreen = true;
      this.updateDom();
    }
  },

  getDom: function() {
    var wrapper = document.getElementById("screensaver");

    if(this.enableBlackScreen) {
      var childNode = wrapper.firstChild;
      childNode.style.display = "none";
      
      wrapper.style.display = "block";
      wrapper.style.backgroundColor = "black";
      wrapper.style.zIndex = 5000;
    } else {
      wrapper.style.display = "none";
    }
  }
});