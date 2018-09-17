const NodeHelper = require("node_helper");

const SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;

const port = new SerialPort("/dev/ttyUSB0", { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: "\n" }));

module.exports = NodeHelper.create({
  subscribe_motion: function() {
    var self = this;
    parser.on("data", data => {
      if (data == 1) {
        self.sendSocketNotification("MOTION_DETECTED", data);
      } else {
        self.sendSocketNotification("NO_MOTION_DETECTED", data);
      }
    });
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "START_MOTION_DETECTION") {
      this.subscribe_motion();
    }
  }
});
