//MMM-SpeechBubble.js:
Module.register("MMM-SpeechBubble", {
	// Default module config.
	defaults: {
		text: "Jarvis will arrive soon, wait for it 😏",
	},

	getStyles: function() {
		return ["MMM-SpeechBubble.css"];
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "speech-bubble normal medium";
		wrapper.innerHTML = this.config.text;

		return wrapper;
	},
});
