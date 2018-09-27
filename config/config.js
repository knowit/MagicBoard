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

	language: "no",
	timeFormat: 24,
	units: "metric",

	modules: {
		topBar: { module: "clock" },

		misc: [{ module: "alert" }], //modules that require no positions

		upperLeft: [
			{
				module: "MMM-YrNow",
				config: {
					locationId: "1-2255826",
					showWeatherForecast: true,
				},
			},
			{ module: "MMM-Placeholder" },
		],
		upperRight: [{ module: "MMM-Placeholder" }],
		lowerLeft: [
			{
				module: "MMM-Ruter",
				header: "Heimdalsgata",
				config: {
					showPlatform: true,
					maxItems: 10,
					showHeader: true,
					fade: true,
					stops: [
						{
							stopId: "3010531",
							platforms: ["2", "5", "6", "11"],
							timeToThere: 5,
						},
					],
				},
			},
		],
		lowerRight: [
			{
				module: "MMM-OsloCityBike",
				header: "Oslo Bysykkel",
				config: {
					lat: {
						min: 59.917154,
						max: 59.917154,
					},
					long: {
						min: 10.762195,
						max: 10.762195,
					},
				},
			},
			{ module: "MMM-Placeholder" },
			{ module: "MMM-Placeholder" },
		],
		footer: [{ module: "MMM-SpeechBubble" }],
	},
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config;
}
