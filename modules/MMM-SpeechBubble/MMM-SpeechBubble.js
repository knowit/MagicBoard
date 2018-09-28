//MMM-SpeechBubble.js:
Module.register("MMM-SpeechBubble", {
    // Default module config.
    defaults: {
        text: "Jarvis will arrive soon, wait for it 😏",
    },

    getStyles: function () {
        return ["MMM-SpeechBubble.css"];
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "speech-bubble normal medium";
        wrapper.innerHTML = this.config.text;

        return wrapper;
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === "FACE_RECOGNITION_USER_LOGIN") {
            this.config.text = payload;

            this.updateDom();

            const self = this;
            setTimeout(function () {
                self.config.text = "What can I do for you?";
                self.updateDom()
            }, 1000 * 3);
        }
        else if (notification === "FACE_RECOGNITION_USER_LOGOUT") {
            this.config.text = payload;

            this.updateDom();

            const self = this;
            setTimeout(function () {
                self.config.text = "Jarvis will arrive soon, wait for it 😏";
                self.updateDom()
            }, 1000 * 3);


        }
    }
});
