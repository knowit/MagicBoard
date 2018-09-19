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

    modules: [
        {
            module: 'MMM-pages',
            config: {
                rotationTime: 1000 * 60,
                modules:
                    [["calendar", "MagicMirror-QuoteCatalog", "MMM-Twitter"],
                        ["MMM-iFrame"],
                        ["MMM-Sundtcommander"],
                        ["MMM-OsloCityBike", "MMM-Ruter", "MMM-YrThen"]],
                excludes: ["MMM-BackgroundSlideshow", "MMM-MotionSensor", "MMM-Facial-Recognition", "alert", "clock", "MMM-YrNow", "MMM-SimpleLogo", "MMM-Hello-Mirror"],
            },
            classes: 'default everyone'
        },
        {
            module: "MMM-Hello-Mirror",
            position: "center",
            classes: "default everyone",
        },
        {
            module: "MMM-MotionSensor",
            classes: 'default everyone'
        },
        {
            module: "alert",
            classes: 'default everyone'
        },
        {
            module: "MMM-BackgroundSlideshow",
            position: "fullscreen_below",
            config: {
                imagePaths: ["modules/MMM-BackgroundSlideshow/exampleImages"],
                transitionImages: true,
                randomizeImageOrder: true,
                slideshowSpeed: 60000 * 5,
                gradient: ["rgba(0, 0, 0, 0.9) 0%", "rgba(0, 0, 0, 0.5) 40%", "rgba(0, 0, 0, 0.5) 80%", "rgba(0, 0, 0, 0.9) 100%"],
                gradientOpacity: 0.9,
            },
            classes: 'default everyone'
        },
        {
            module: "clock",
            position: "top_left",
            classes: 'default everyone'
        },
        {
            module: "calendar",
            header: "Fag & Events",
            position: "top_left",
            config: {
                wrapEvents: true,
                fade: false,
                calendars: [
                    {
                        //  Kalender for Fag
                        symbol: "book",
                        url: ""
                    },
                    {
                        //  Kalender for Events
                        symbol: "smile-o",
                        url: ""
                    }
                ]
            },
            classes: 'default everyone'
        },
        {
            module: "MMM-Sundtcommander",
            position: "upper_third",
            classes: 'default everyone'
        },
        {
            module: "MMM-YrNow",
            position: "top_right",
            config: {
                locationId: "1-2255826",
                showWeatherForecast: true
            },
            classes: 'default everyone'
        },
        {
            module: 'MMM-YrThen',
            header: 'Lakkegata Værvarsel',
            position: 'top_right',
            config: {
                location: '1-2255826',
            },
            classes: 'default everyone'
        },
        {
            module: 'MMM-Twitter',
            position: 'top_right',
            header: "Knowit Twitter",
            config: {
                consumer_key: '',
                consumer_secret: '',
                access_token_key: '',
                access_token_secret: '',
                screenName: '',
                listToShow: '',
                maxTweetAgeMins: 1440 * 50,
                excludeRetweets: false,
                excludeTweetsWithQuotes: false,
                excludeMediaTweets: false,
                excludeLinkTweets: false,
                excludeTweetsWithoutText: true,
                maxTweetsPerUser: 'zero',
                allowSpecialCharacters: true,
                displayColors: ['#fff'],
            },
            classes: 'default everyone'
        },
        {
            module: "MMM-OsloCityBike",
            header: "Oslo Bysykkel",
            position: "top_left",
            config: {
                lat: {
                    min: 59.917154,
                    max: 59.917154
                },
                long: {
                    min: 10.762195,
                    max: 10.762195
                }
            },
            classes: 'default everyone'
        },
        {
            module: "MMM-iFrame",
            position: "lower_third",	// This can be any of the regions.
            config: {
                url: ["http://35.158.126.129:3000/d-solo/wUjXxdhmk/office-monitor?orgId=1&panelId=2&theme=dark"],  // as many URLs you want or you can just ["ENTER IN URL"] if single URL.
            },
            classes: 'default everyone'
        },
        {
            module: "MMM-iFrame",
            position: "lower_third",	// This can be any of the regions.
            config: {
                // See "Configuration options" for more information.
                url: ["http://35.158.126.129:3000/d-solo/wUjXxdhmk/office-monitor?orgId=1&panelId=6&theme=dark"],  // as many URLs you want or you can just ["ENTER IN URL"] if single URL.
            },
            classes: 'default everyone'
        },
        {
            module: "MMM-iFrame",
            position: "lower_third",	// This can be any of the regions.
            config: {
                // See "Configuration options" for more information.
                url: ["http://35.158.126.129:3000/d-solo/wUjXxdhmk/office-monitor?orgId=1&panelId=4&&theme=dark"],  // as many URLs you want or you can just ["ENTER IN URL"] if single URL.
            },
            classes: 'default everyone'
        },
        {
            module: "MMM-Ruter",
            header: "Heimdalsgata Trikk",
            position: "top_left",
            config: {
                showPlatform: true,
                maxItems: 15,
                showHeader: true,
                fade: false,
                stops: [
                    {
                        stopId: "3010531",
                        platforms: ["2", "5", "6", "11"],
                        timeToThere: 5,
                    }
                ]
            },
            classes: 'default everyone'
        },
        /*{
            module: "MagicMirror-QuoteCatalog",
            position: "bottom_center"
        },*/
        {
            module: 'MMM-SimpleLogo',
            position: 'bottom_left',
            config: {},
            classes: 'default everyone'
        },
        {
            module: 'MMM-Facial-Recognition',
            config: {
                // 1=LBPH | 2=Fisher | 3=Eigen
                recognitionAlgorithm: 1,
                // Threshold for the confidence of a recognized face before it's considered a
                // positive match.  Confidence values below this threshold will be considered
                // a positive match because the lower the confidence value, or distance, the
                // more confident the algorithm is that the face was correctly detected.
                lbphThreshold: 40,
                fisherThreshold: 250,
                eigenThreshold: 3000,
                // force the use of a usb webcam on raspberry pi (on other platforms this is always true automatically)
                useUSBCam: false,
                // Path to your training xml
                trainingFile: 'modules/MMM-Facial-Recognition/training.xml',
                // recognition intervall in seconds (smaller number = faster but CPU intens!)
                interval: 5,
                // Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
                logoutDelay: 15,
                // Array with usernames (copy and paste from training script)
                users: ["Petter"],
                //Module set used for strangers and if no user is detected
                defaultClass: "default",
                //Set of modules which should be shown for every user
                everyoneClass: "everyone",
                // Boolean to toggle welcomeMessage
                welcomeMessage: true
            }
        },
    ]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
    module.exports = config;
}