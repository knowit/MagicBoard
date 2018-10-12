/* global Module */

/* Smart button
 * Module: MMM-SmartButton
 *
 *
 *
 */

Module.register("MMM-SmartButton", {
    defaults: {},

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification("START_BUTTON_LISTENING", {});
    },

    notificationReceived: function(notification, payload){
        if (notification === "FACE_RECOGNITION_USER_LOGOUT") {
            this.sendSocketNotification("TURN_OFF_BUTTON_LIGHT")
        }
    },


    // the socket handler
    socketNotificationReceived: function(notification, payload) {

        Log.log(
            this.name +
            " received a socket notification: " +
            notification +
            " - Payload: " +
            payload,
        );

        if (notification === "BUTTON_PRESSED") {

            if(payload == 1){
                this.sendNotification("BUTTON_TOGGLE_FACE_RECOGNITION", {});
            }
            if(payload == 2){
                this.sendNotification("NEXT_BOARD", {});
            }

            if(payload == 3){
                this.sendNotification("PREVIOUS_BOARD", {});
            }
        }
    },
});
