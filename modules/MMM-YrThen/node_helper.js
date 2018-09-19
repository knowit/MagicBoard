// Reminder to self: tail -f ~/.pm2/logs/MagicMirror-out-0.log
var NodeHelper = require('node_helper');
var request = require('request');

var d = new Date();
var n = d.toLocaleDateString() + " " + d.toLocaleTimeString();
// console.log("MMM-YrThen " + n + ": Starting MMM-YrThen in node_helper");

module.exports = NodeHelper.create({
    start: function() {
        var d = new Date();
        var n = d.toLocaleDateString() + " " + d.toLocaleTimeString();
        console.log("MMM-YrThen " + n + ": Starting helper for MMM-YrThen");
        this.config = null;
        this.forecastUrl = '';
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this;
        var d = new Date();
        var n = d.toLocaleDateString() + " " + d.toLocaleTimeString();
//        console.log("MMM-YrThen " + n + ": Received notification");
        if(notification === 'GET_YRTHEN_FORECAST') {
            var d = new Date();
            var n = d.toLocaleDateString() + " " + d.toLocaleTimeString();
//            console.log("MMM-YrThen " + n + ": Received GET_YRTHEN_FORECAST notification");
            self.config = payload.config;
            self.forecastUrl = payload.forecastUrl;
            this.getForecastFromYrThen();
        }
    },

    getForecastFromYrThen: function() {
        var d = new Date();
        var n = d.toLocaleDateString() + " " + d.toLocaleTimeString();
//        console.log("MMM-YrThen " + n + ": Getting forecast");
        var self = this;
        var locationData = {};

        request({url: self.forecastUrl, method: 'GET'}, function(error, response, message) {
            var d = new Date();
            var n = d.toLocaleDateString() + " " + d.toLocaleTimeString();
//            console.log("MMM-YrThen " + n + ": Requesting forecast from" + self.forecastUrl);
            if (!error && (response.statusCode == 200 || response.statusCode == 304)) {
                locationData.forecast = JSON.parse(message);
                var d = new Date();
                var n = d.toLocaleDateString() + " " + d.toLocaleTimeString();
//                console.log("MMM-YrThen " + n + ": Returning forecast");
                self.sendSocketNotification('YRTHEN_FORECAST_DATA', locationData);
            }
            else{
                var d = new Date();
                var n = d.toLocaleDateString() + " " + d.toLocaleTimeString();
//                console.log("MMM-YrThen " + n + ": Error!");
            }
        });
    }

});
