/* global Module */

/* Magic Mirror
 * Module: iFrame
 *
 * By Ben Williams http://desertblade.com
 * MIT Licensed.
 */

Module.register("MMM-iFrame", {
    // Default module config.
    defaults: {
        height: "300px",
        width: "100%",
        updateInterval: 0.5 * 60 * 1000,
        url: ["http://magicmirror.builders/"],
        scrolling: "no",
        uniqueID: 0,
        initialUpdateInterval: 10 * 1000,
    },

    start: function () {
        const self = this;
        this.scheduleUpdate(this.config.initialUpdateInterval);

        setInterval(function () {
            self.updateDom();
        }, this.config.updateInterval);
    },
    scheduleUpdate: function (delay) {
        const self = this;
        this.config.now = Date.now();

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function () {
            self.sendSocketNotification('UPDATE_IFRAME', self.config);
        }, !!delay ? delay : this.config.updateInterval);
    },
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    resume: function () {
        console.log("Resuming");
        return this.getDom();
    },

    // Override dom generator.
    getDom: function () {
        var iframe = document.createElement("IFRAME");
        iframe.style = "border:0";
        iframe.width = this.config.width;
        iframe.height = this.config.height;
        iframe.scrolling = this.config.scrolling;
        var url_index = 0;
        //       console.log("currentURL:" + this.currentURL);
        var repeat = true;
        while (repeat) {
            url_index = this.getRandomInt(0, this.config.url.length);
            const futureURL = this.config.url[url_index];
            console.log("URL_length:" + this.config.url.length + " " + "URL_index:" + url_index + " " + "url:" + futureURL);
            iframe.src = futureURL;
            repeat = false;
        }
        return iframe;
    },

    socketNotificationReceived: function(notification, payload) {
        if(notification === "UPDATE_IFRAME" && payload.uniqueID === this.uniqueID){
            this.updateDom(1000);
            this.scheduleUpdate();
        }
    },

});
