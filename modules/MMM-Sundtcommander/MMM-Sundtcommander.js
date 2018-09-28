/* global Module */

Module.register("MMM-Sundtcommander", {
    defaults: {
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
        iframe.style.width = "inherit";
        iframe.style.height = "inherit";
        iframe.scrolling = this.config.scrolling;
        iframe.src = this.config.url;

        return iframe;
    }
});
