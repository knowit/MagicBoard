const NodeHelper = require("node_helper");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");


const port = new SerialPort(config.comportSmartButton, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: "\n" }));

module.exports = NodeHelper.create({
    subscribe_motion: function() {
        var self = this;
        parser.on("data", data => {
            console.log(data);
            self.sendSocketNotification("BUTTON_PRESSED", data);


        });
    },

    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "START_BUTTON_LISTENING") {
            port.write("TURN_OFF_BUTTON_LIGHT"); //Turn off facial recognition light on controller on startup
            this.subscribe_motion();
        }

        if (notification === "TURN_OFF_BUTTON_LIGHT") {
            port.write("TURN_OFF_BUTTON_LIGHT"); //Turn off facial recognition light on controller.

        }

    },


});
