const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
    start: function () {
        console.log('--- ' + this.name + ': Node Helper Start');
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'UPDATE_IFRAME') {
            this.sendSocketNotification("UPDATE_IFRAME", payload);
        }
    },
});