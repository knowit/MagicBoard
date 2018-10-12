/* global Module */

/* Magic Mirror
 * Module: MMM-Facial-Recognition-OC3
 *
 * By Mathieu Goulène - Based on work made by Paul-Vincent Roll 
 * MIT Licensed.
 */

Module.register('MMM-Facial-Recognition-OCV3', {

    defaults: {
        // Threshold for the confidence of a recognized face before it's considered a
        // positive match.  Confidence values below this threshold will be considered
        // a positive match because the lower the confidence value, or distance, the
        // more confident the algorithm is that the face was correctly detected.
        threshold: 50,
        // force the use of a usb webcam on raspberry pi (on other platforms this is always true automatically)
        useUSBCam: false,
        // Path to your training xml
        trainingFile: 'modules/MMM-Facial-Recognition-OCV3/training.xml',
        // recognition intervall in seconds (smaller number = faster but CPU intens!)
        interval: 2,
        // Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
        logoutDelay: 15,
        // Array with usernames (copy and paste from training script)
        users: [],
        //Module set used for strangers and if no user is detected
        defaultClass: "default",
        //Set of modules which should be shown for every user
        everyoneClass: "everyone",
        // Boolean to toggle welcomeMessage
        welcomeMessage: true
    },

    start: function () {
        this.current_user = null;
        this.sendSocketNotification('CONFIG', this.config);
        Log.info('Starting module: ' + this.name);
    },

    getScripts: function () {
        return ["classie.js", "modernizr.custom.js", "webcamnotification.js", "webcam.js"];
    },

    getStyles: function () {
        return ["MMM-Facial-Recognition-OCV3.css"];
    },

    // Define required translations.
    getTranslations: function () {
        return {
            en: "translations/en.json",
            de: "translations/de.json",
            es: "translations/es.json",
            zh: "translations/zh.json",
            nl: "translations/nl.json",
            sv: "translations/sv.json",
            fr: "translations/fr.json",
            id: "translations/id.json"
        };
    },

    login_user: function () {
        var self = this;

        /*MM.getModules().withClass(this.config.defaultClass).exceptWithClass(this.config.everyoneClass).enumerate(function(module) {
            module.hide(1000, function() {
                Log.log(module.name + ' is hidden.');
            }, {lockString: self.identifier});
        });

        MM.getModules().withClass(this.current_user).enumerate(function(module) {
            module.show(1000, function() {
                Log.log(module.name + ' is shown.');
            }, {lockString: self.identifier});
        });*/

        this.sendNotification("CURRENT_USER", this.current_user);
    },
    logout_user: function () {
        var self = this;

        /*MM.getModules().withClass(this.current_user).enumerate(function(module) {
            module.hide(1000, function() {
                Log.log(module.name + ' is hidden.');
            }, {lockString: self.identifier});
        });

        MM.getModules().withClass(this.config.defaultClass).exceptWithClass(this.config.everyoneClass).enumerate(function(module) {
            module.show(1000, function() {
                Log.log(module.name + ' is shown.');
            }, {lockString: self.identifier});
        });*/

        this.sendNotification("CURRENT_USER", "None");
    },

    // Override socket notification handler.
    socketNotificationReceived: function (notification, payload) {
        if (payload.action === "login") {
            if (this.current_user_id !== payload.user) {
                this.logout_user();
            }
            if (payload.user === -1) {
                if (this.config.welcomeMessage) {
                    //this.sendNotification("FACE_RECOGNITION_USER_LOGIN", this.translate("unknownPerson"));
                    //this.sendNotification("SHOW_ALERT", {type: "notification", message: this.translate("message").replace("%person", this.current_user), title: this.translate("title")});
                }
                this.current_user_id = payload.user;
            }
            else {
                this.current_user = this.config.users[payload.user];
                if (this.config.welcomeMessage) {
                    this.sendNotification("FACE_RECOGNITION_USER_LOGIN", this.translate("knownPerson").replace("%person", this.current_user));
                    this.current_user_id = payload.user;
                    this.login_user();
                }
                //this.current_user_id = payload.user;
                //this.login_user();
            }

        }
        /*else if(payload.action === "logout_with_delay"){
            this.sendNotification("FACE_RECOGNITION_USER_LOGOUT", this.translate("logout"));
            this.logout_user();
            this.current_user = null;
            this.toggleFacialRecognition();

        }*/
        else if (payload.action === "logout") {
            this.sendNotification("FACE_RECOGNITION_USER_LOGOUT", this.translate("logout"));
            this.logout_user();
            this.current_user = null;
            this.toggleFacialRecognition();
        }
    },

    notificationReceived: function (notification, payload, sender) {
        console.log(notification, payload);
        if (notification === "BUTTON_TOGGLE_FACE_RECOGNITION") {
            this.toggleFacialRecognition();

            /*if (notification === 'DOM_OBJECTS_CREATED') {
          var self = this;
                /*MM.getModules().exceptWithClass("default").enumerate(function(module) {
                    module.hide(1000, function() {
                        Log.log('Module is hidden.');
                    }, {lockString: self.identifier});
                });*/
        }
        if(notification === "KEYPRESS"){
            const self = this;
            switch (payload.KeyName) {
                case "ArrowUp":
                    self.toggleFacialRecognition();
                    break;
                default:
                    break;
            }
        }

    },

    toggleFacialRecognition: function () {
        this.sendSocketNotification("FACIAL_RECOGNITION_TOGGLE");
        if (this.alert) {
            this.alert.toggleOnOff();
            this.alert = null;
            this.sendNotification("FACE_RECOGNITION_USER_LOGOUT");
        }
        else {
            this.alert = new WebcamNotification();
            this.alert.toggleOnOff();

            const self = this;
            setTimeout(function () {
                if (self.current_user === null) {
                    self.toggleFacialRecognition();
                }
            }, 1000 * (self.config.logoutDelay + 5));

        }
    },
});
