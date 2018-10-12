var NodeHelper = require("node_helper");
let PythonShell = require('python-shell');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);

    },

    socketNotificationReceived(notification, payload) {
        const self = this;

        if (notification === "GET_ENTUR_DATA") {
            let pyshell = new PythonShell("modules/" + this.name + "/scripts/citybike.py", { mode: "json", args: [payload.longitude, payload.latitude, payload.max_distance]});

            pyshell.on("message", function (message) {
                self.sendSocketNotification("ENTUR_DATA", message)
            });

            pyshell.end(function (err) {
                if (err) throw err;
            });
        }
    }


});
