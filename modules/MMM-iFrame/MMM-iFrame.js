/* global Module */

Module.register("MMM-iFrame", {
	// Default module config.
	defaults: {
		url: ["http://magicmirror.builders/"],
		scrolling: "no",
	},

    start: function() {
	    this.nextUrlIndex = 0;
    },

    //  Updates dom every time the module is shown on the board
	resume: function() {
	    this.updateDom()
	},

	// Override dom generator.
	// Roterer mellom de oppgitte URLene
	getDom: function() {
		const iframe = document.createElement("IFRAME");
		iframe.style = "border:0";
		iframe.style.width = "inherit";
		iframe.style.height = "inherit";
		iframe.scrolling = this.config.scrolling;

		iframe.src = this.config.url[this.nextUrlIndex];

		if ((this.nextUrlIndex += 1) >= this.config.url.length) this.nextUrlIndex = 0;

		return iframe;
	},
});
