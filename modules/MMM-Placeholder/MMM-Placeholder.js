//MMM-Placeholder.js:

Module.register("MMM-Placeholder",{
	// Default module config.
	defaults: {
		text: "?"
    },
    
    getStyles: function() {
		return ['mmm-placeholder.css'];
	},

	// Override dom generator.
	getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "questionMark"
		wrapper.innerHTML = this.config.text;
		return wrapper;
	}
});