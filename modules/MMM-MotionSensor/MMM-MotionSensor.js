/* global Module */

/* Motion Sensor
 * Module: MMM-MotionSensor
 *
 * 
 * MIT Licensed.
 */

Module.register("MMM-MotionSensor", {
	defaults: {},

	getStyles: function() {
		return ["MMM-MotionSensor.css"];
	},

	start: function() {
		Log.info("Starting module: " + this.name);
		this.enableBlackScreen = false;
		this.updateDom();
		this.sendSocketNotification("START_MOTION_DETECTION", {});
	},

	// the socket handler
	socketNotificationReceived: function(notification, payload) {
		Log.log(
			this.name +
				" received a socket notification: " +
				notification +
				" - Payload: " +
				payload,
		);

		if (notification === "MOTION_DETECTED" && this.enableBlackScreen) {
			this.enableBlackScreen = false;
			this.updateDom();
		} else if (
			notification === "NO_MOTION_DETECTED" &&
			!this.enableBlackScreen
		) {
			this.enableBlackScreen = true;
			this.updateDom();
		}
	},

	getDom: function() {
		var wrapper = document.getElementById("fullscreen-container");

		if (this.enableBlackScreen) {
			wrapper.style.display = "flex";
		} else {
			wrapper.style.display = "none";
		}
	},
});
