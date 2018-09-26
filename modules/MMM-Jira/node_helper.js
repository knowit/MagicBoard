const NodeHelper = require("node_helper");
let PythonShell = require('python-shell');

module.exports = NodeHelper.create({
    socketNotificationReceived(notification, payload) {
        const self = this;

        if (notification === "JIRA_GET_DATA") {
            let pyshell = new PythonShell("modules/" + this.name + "/scripts/main.py", { mode: "json"});

            pyshell.on("message", function (message) {
                self.sendSocketNotification("JIRA_DATA", message)
            });

            pyshell.end(function (err) {
                if (err) throw err;
            });
        }
    }
});