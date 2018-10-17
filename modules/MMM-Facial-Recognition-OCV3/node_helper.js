"use strict";
const { readdirSync } = require("fs");
const rimraf = require("rimraf");
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
			var self = this;
			const pythonCapture = new PythonShell(
				"modules/" + this.name + "/tools.capture.py",
				{
					mode: "text",
					args: [payload],
				},
			);

			pythonCapture.on("message", function(message) {
				console.log(message);
			});

			pythonCapture.end(function(err) {
				if (err) throw err;
				console.log("[" + this.name + "] " + "finished running...");
				self.sendSocketNotification("FINISHED_TAKING_PICTURE");
			});
		} else if (notification === "TRAIN_MODEL") {
			var self = this;
			const pythonTrain = new PythonShell(
				"modules/" + this.name + "/tools.train.py",
			);

			pythonTrain.on("message", function(message) {
				console.log(message);
			});

			pythonTrain.end(function(err) {
				if (err) throw err;
				console.log("[" + self.name + "] " + "finished running...");
				self.sendSocketNotification("FINISHED_TRAINING_MODEL");
			});
		} else if (notification === "FACIAL_RECOGNITION_TOGGLE") {
			if (!pythonRunning) {
				const self = this;
				const users = readdirSync(__dirname + "/training_data");
				this.config = Object.assign(this.config, { users });
				pyshell = new PythonShell(
					"modules/" + this.name + "/lib/mm/facerecognition.py",
					{
						mode: "json",
						args: [JSON.stringify(self.config)],
					},
				);
				pythonRunning = true;
				this.pythonStart();
			} else {
				console.log(this.name, "FACIAL_RECOGNITION_STOP");
				pythonRunning = false;
				this.pythonStop();
			}
		} else if (notification === "GET_USERS") {
			const users = readdirSync(__dirname + "/training_data");
			const self = this;
			self.sendSocketNotification("USER_RETRIEVED", users);
		} else if (notification === "GET_USERS_AND_START") {
			const users = readdirSync(__dirname + "/training_data");
			const self = this;
			self.sendSocketNotification("USER_RETRIEVED_AND_START", users);
		} else if (notification === "REMOVE_USER") {
			rimraf(`${__dirname}/training_data/${payload}`, () =>
				console.log("Successfully deleted", payload),
			);
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
