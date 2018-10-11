/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See ://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
    address: "localhost", // Address to listen on, can be:
    // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
    // - another specific IPv4/6 to listen on a specific interface
    // - "", "0.0.0.0", "::" to listen on any interface
    // Default, when address config is left out, is "localhost"
    port: 8080,
    ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
    // or add a specific IPv4 of 192.168.1.5 :
    // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
    // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
    // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

    comportSmartButton: "COM3",
    comportMotionSensor: "COM4",


    language: "en",
    timeFormat: 24,
    units: "metric",

    modules: {
        topBar: {module: "clock"}, // Kun en module
        misc: [{module: "alert"}, {module: "MMM-Boards"}, {
            module: 'MMM-KeyBindings',
            config: {
                enableNotifyServer: false,
                enableMousetrap: true,
            }
        },], // modules that require no positions
        boards: [
            {
                upperLeft: [{module: "MMM-Placeholder"}],
                lowerLeft: [{module: "MMM-Placeholder"}],
                upperRight: [{module: "MMM-Placeholder"}],
                lowerRight: [{module: "MMM-Placeholder"}],
            },
            {
                upperLeft: [{module: "MMM-Placeholder"}],
                lowerLeft: [{module: "MMM-Placeholder"}],
                upperRight: [{module: "MMM-Placeholder"}],
                lowerRight: [{module: "MMM-Placeholder"}],
            },
        ],
        footer: [{module: "MMM-SpeechBubble"}],
    },
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
    module.exports = config;
}