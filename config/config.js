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

    language: "en",
    timeFormat: 24,
    units: "metric",

    modules: [
        {
            module: "MMM-Carousel",
            config: {
                transitionInterval: 1000 * 60 * 0.5, // 30 sek
                ignoreModules: ["MMM-BackgroundSlideshow", "updatenotification", "clock", "MMM-YrNow", "MMM-iFrame", "MMM-Placeholder"],
                mode: "slides",
                slides: [
                    ["calendar", "MMM-QuoteOfTheDay"],
                    ["MMM-OsloCityBike", "MMM-Ruter"]
                ]
            }
        },
        {
            module: "alert",
        },
        {
            module: "MMM-BackgroundSlideshow",
            position: "fullscreen_below",
            config: {
                imagePaths: ["modules/MMM-BackgroundSlideshow/exampleImages"],
                transitionImages: true,
                randomizeImageOrder: true,
                slideshowSpeed: 60000 * 5,
            }
        },
        {
            module: "updatenotification",
            position: "top_bar"
        },
        {
            module: "clock",
            position: "top_left"
        },
        {
            module: "calendar",
            header: "Fag & Events",
            position: "top_left",
            config: {
                calendars: [
                    {
                        //  Kalender for Fag
                        symbol: "book",
                        // url:
                        url: ""
                    },
                    {
                        //  Kalender for Events
                        symbol: "smile-o",
                        //url:
                        url: ""
                    }
                ]
            }
        },
        {
            module: "MMM-YrNow",
            position: "top_right",
            config: {
                locationId: "1-2255826",
                showWeatherForecast: true
            }
        },
        {
            module: "MMM-OsloCityBike",
            header: "Oslo CityBike",
            position: "top_right",
            config: {
                lat: {
                    min: 59.917154,
                    max: 59.917154
                },
                long: {
                    min: 10.762195,
                    max: 10.762195
                }
            }
		},
		{
			module: "MMM-iFrame",
			position: "lower_third",	// This can be any of the regions.
			config: {
				// See "Configuration options" for more information.
				url: ["http://35.158.126.129:3000/d-solo/wUjXxdhmk/office-monitor?orgId=1&panelId=2&theme=dark, http://35.158.126.129:3000/d-solo/wUjXxdhmk/office-monitor?orgId=1&panelId=6&theme=dark", "http://35.158.126.129:3000/d-solo/wUjXxdhmk/office-monitor?orgId=1&panelId=4&&theme=dark"],  // as many URLs you want or you can just ["ENTER IN URL"] if single URL.
				updateInterval: 0.5 * 60 * 1000, // rotate URLs every 30 seconds
				width: "80%", // Optional. Default: 100%
				height: "600px" //Optional. Default: 100px
			}
		},
        {
            module: "MMM-Ruter",
            header: "Heimdalsgate",
            position: "top_right",
            config: {
                showPlatform: true,
                maxItems: 15,
                showHeader: true,
                stops: [
                    {
                        stopId: "3010531",
                        platforms: ["2", "5", "6", "11"],
                        timeToThere: 5,
                    }
                ]
            }
        },
        {
            module: "MMM-QuoteOfTheDay",
            position: "middle_center"
		},
		{
            module: "MMM-Placeholder",
            position: "bottom_center"
		},
    ]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
    module.exports = config;
}
