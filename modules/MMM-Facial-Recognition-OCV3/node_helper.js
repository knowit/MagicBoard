"use strict";
const NodeHelper = require("node_helper");

const PythonShell = require("python-shell");
let pythonRunning = false;
let pyshell;

module.exports = NodeHelper.create({
	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "CONFIG") {
			this.config = payload;
		} else if (notification === "FACIAL_CAMERA_CAPTURE") {
			console.log(this.name, "INITIALIZE_CAMERA_CAPTURE", payload);
			const pythonCapture = new PythonShell(
				"modules/" + this.name + "/tools.capture.py",
				{
					mode: "text",
					args: [payload],
				},
			);

			pythonCapture.on("message", function(message) {
				console.log("*MESSAGE*", message);
			});

			pythonCapture.end(function(err) {
				if (err) throw err;
				console.log("[" + this.name + "] " + "finished running...");
			});
		} else if (notification === "FACIAL_RECOGNITION_TOGGLE") {
			if (!pythonRunning) {
				console.log(this.name, "FACIAL_RECOGNITION_START");
				pyshell = new PythonShell(
					"modules/" + this.name + "/lib/mm/facerecognition.py",
					{
						mode: "json",
						args: [JSON.stringify(this.config)],
					},
				);
				pythonRunning = true;
				this.pythonStart();
			} else {
				console.log(this.name, "FACIAL_RECOGNITION_STOP");
				pythonRunning = false;
				this.pythonStop();
			}
		}
	},

	pythonStart: function() {
		const self = this;

		pyshell.on("message", function(message) {
			if (message.hasOwnProperty("status")) {
				console.log("[" + self.name + "] " + message.status);
			} else if (message.hasOwnProperty("login")) {
				console.log(
					"[" +
						self.name +
						"] " +
						"User " +
						self.config.users[message.login.user - 1] +
						" with confidence " +
						message.login.confidence +
						" logged in.",
				);
				self.sendSocketNotification("user", {
					action: "login",
					user: message.login.user - 1,
					confidence: message.login.confidence,
				});
			} else if (message.hasOwnProperty("logout")) {
				console.log(
					"[" +
						self.name +
						"] " +
						"User " +
						self.config.users[message.logout.user - 1] +
						" logged out.",
				);
				self.sendSocketNotification("user", {
					action: "logout",
					user: message.logout.user - 1,
				});
			}
		});

		pyshell.end(function(err) {
			if (err) throw err;
			console.log("[" + self.name + "] " + "finished running...");
		});
	},

	pythonStop: function() {
		pyshell.childProcess.kill("SIGINT");
	},
});
