/* global Module */

Module.register("MMM-Sundtcommander", {
    defaults: {
        height: "1200px",
        width: "1200px",
        url: "http://sundtcommander.knowit.no/",
        scrolling: "no",
    },

    start: function () {
        this.updateDom();
    },

    resume: function () {
        console.log("Resuming");
        return this.getDom();
    },

    // Override dom generator.
    getDom: function () {
        const iframe = document.createElement("IFRAME");
        iframe.style = "border:0";
        iframe.width = this.config.width;
        iframe.height = this.config.height;
        iframe.scrolling = this.config.scrolling;
        iframe.src = this.config.url;

        return iframe;
    }
});
