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
            console.log("Hei buton has been pressed " + payload);
            if(payload == 1){
                console.log("Starter kamera ");
                this.sendNotification("BUTTON_TOGGLE_FACE_RECOGNITION", {});
            }
        }
    },
});
