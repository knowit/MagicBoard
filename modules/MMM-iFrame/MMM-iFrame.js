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
        height: "600px",
        width: "80%",
        updateInterval: 60 * 1000,
        url: ["http://magicmirror.builders/"],
        scrolling: "no",
    },

    start: function () {
        this.nextUrlIndex = 0;
        const self = this;

        setInterval(function () {
            self.updateDom();
        }, this.config.updateInterval);
    },

    resume: function () {
        console.log("Resuming");
        return this.getDom();
    },

    // Override dom generator.
    // Roterer mellom de oppgitte URLene
    getDom: function () {
        const iframe = document.createElement("IFRAME");
        iframe.style = "border:0";
        iframe.width = this.config.width;
        iframe.height = this.config.height;
        iframe.scrolling = this.config.scrolling;

        const futureURL = this.config.url[this.nextUrlIndex];
        console.log("URL_length:" + this.config.url.length + " " + "URL_index:" + this.nextUrlIndex + " " + "url:" + futureURL);
        iframe.src = futureURL;

        this.nextUrlIndex++;
        if(this.nextUrlIndex >= this.config.url.length){
            this.nextUrlIndex = 0;
        }

        return iframe;
    },
});
