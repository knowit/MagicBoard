/* Magic Mirror
 * Module: MMM-Hello-Mirror
 * 
 * By Mathias Kaniut
 * MIT Licensed
 */

Module.register("MMM-Hello-Mirror", {
    // Default module config.
    defaults: {
        animationSpeed: 2000,
        language: "no",
        voice: "Norwegian Female",
        debug: true,
        broadcastEvents: true
    },

    // Load required additional scripts
    getScripts: function () {
        return [
            "//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js", // annyang! SpeechRecognition
            "http://code.responsivevoice.org/responsivevoice.js", // ResponsiveVoice
            "moment.js" // Parse, validate, manipulate, and display dates in JavaScript
        ];
    },

    // Define additional styles
    getStyles: function () {
        return ["font-awesome.css", this.file("css/MMM-Hello-Mirror.css")];
    },

    // Request translation files
    getTranslations: function () {
        return {
            en: "translations/en.json",
            no: "translations/no.json"
        };
    },

    textMessage: "",

    // Called when all modules are loaded an the system is ready to boot up
    start: function () {
        if (responsiveVoice) {
            responsiveVoice.setDefaultVoice(this.config.voice);
        }

        const self = this;

        if (annyang) {
            Log.info("Starting module: " + this.name);

            // Set language for date object
            moment.locale(this.config.language);

            // annyang innstillinger
            annyang.debug(this.config.debug);
            annyang.setLanguage(this.config.language);

            //annyang.addCommands(commands);

            annyang.addCommands(this.getCommands());

            // Add callback functions for errors
            annyang.addCallback("error", function () {
                Log.error(
                    "ERROR in module " +
                    self.name +
                    ": " +
                    "Speech Recognition fails because an undefined error occured"
                );
            });
            annyang.addCallback("errorNetwork", function () {
                Log.error(
                    "ERROR in module " +
                    self.name +
                    ": " +
                    "Speech Recognition fails because of a network error"
                );
            });
            annyang.addCallback("errorPermissionBlocked", function () {
                Log.error(
                    "ERROR in module " +
                    self.name +
                    ": " +
                    "Browser blocks the permission request to use Speech Recognition"
                );
            });
            annyang.addCallback("errorPermissionDenied", function () {
                Log.error(
                    "ERROR in module " +
                    self.name +
                    ": " +
                    "The user blocks the permission request to use Speech Recognition"
                );
            });
            annyang.addCallback("resultNoMatch", function (phrases) {
                Log.error(
                    "ERROR in module " +
                    self.name +
                    ": " +
                    "No match for voice command " +
                    phrases
                );
            });
            annyang.addCallback("soundstart", function () {
                self.textMessage = self.translate("HEAR_YOU");
                self.updateDom(self.config.animationSpeed);
            });
            annyang.addCallback("result", function () {
                self.textMessage = "";
                self.updateDom(self.config.animationSpeed);
            });

            // Start listening
            annyang.start();
        } else {
            Log.error(
                "ERROR in module " +
                self.name +
                ": " +
                "Google Speech Recognizer is down :("
            );
        }
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "small light";
        wrapper.innerHTML = this.textMessage;
        return wrapper;
    },

    getCommands: function (responsiveVoice) {
        return {
            "Hello": () => {
                this.notification("VOICE_COMMAND", "");
                this.response(responsiveVoice, "VOICE_ACCEPTED");
            },
            "Bytt Backgrunn": () => {
                this.notification("BACKGROUND_CHANGE", "");
                this.response(responsiveVoice, "BAKGRUNN_BYTT");
            },
            "Neste Side": () => {
                this.notification("PAGE_INCREMENT", 1);
                this.response(responsiveVoice, "SIDE_NESTE");
            },
            "Forrige Side": () => {
                this.notification("PAGE_DECREMENT", -1);
                this.response(responsiveVoice, "SIDE_FORRIGE");
            },
            "Første Side": () => {
                this.notification("PAGE_CHANGED", 0);
                this.response(responsiveVoice, "SIDE_FØRSTE");
            },
            "Vis Bygginfo": () => {
                this.notification("PAGE_CHANGED", 0);
                this.response(responsiveVoice, "SIDE_BYGGINFO");
            },
            "Vis Kalender": () => {
                this.notification("PAGE_CHANGED", 1);
                this.response(responsiveVoice, "SIDE_KALENDER");
            },
            "Vis Værmelding": () => {
                this.notification("PAGE_CHANGED", 2);
                this.response(responsiveVoice, "SIDE_VÆRMELDING");
            },
        };
    },

    notification: function (notification, payload) {
        if (this.config.broadcastEvents) {
            this.sendNotification(notification, payload);
        }
    },

    response: function (responsiveVoice, response) {
        if (responsiveVoice) {
            responsiveVoice.speak(this.translate(response));
        }
    }
});