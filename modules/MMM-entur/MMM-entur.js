/* Magic Mirror
 * Module: entur
 * MIT Licensed.
 */

Module.register("MMM-entur", {
    // Default module config.
    defaults: {
        position: [0, 0],
        max_distance: 500,
        zoom: 16,
        mapboxAccessToken: "",
        updateInterval: 1000 * 60 * 2

    },

    getStyles: function () {
        return ["MMM-entur.css", "https://api.tiles.mapbox.com/mapbox-gl-js/v0.49.0/mapbox-gl.css"];
    },

    getScripts: function () {
        return ["https://api.tiles.mapbox.com/mapbox-gl-js/v0.49.0/mapbox-gl.js"];
    },

    getTranslations: function () {
        return {
            en: "translations/en.json",
            no: "translations/no.json",
        };
    },

    start: function () {
        console.log(this.translate("STARTINGMODULE") + ": " + this.name);



        this.sendSocketNotification("GET_ENTUR_DATA", {longitude: this.config.position[0], latitude: this.config.position[1], max_distance: this.config.max_distance});

    },

    socketNotificationReceived(notification, payload) {
        if (notification === "ENTUR_DATA") {
            this.data = payload;
            this.addCitybikesToMap();
        }
    },

    addCitybikesToMap: function () {
        var geojson = this.data["stations"];

        const self = this;
        this.map.loadImage('modules/MMM-entur/img/citybike.png', function (error, image) {
            if (error) throw error;
            self.map.addImage('citybike', image);
            self.map.addLayer({
                "id": "citybikeStations",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": geojson
                },
                "layout": {
                    "icon-image": "{icon}",
                    "text-field": "{title}",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 0.6],
                    "text-anchor": "top",
                    "icon-size": 0.05
                },
                "paint": {
                    "text-color": "#fff",
                    "text-halo-width": 1,
                    "text-halo-color": "#000"
                }
            });
        });
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";

        mapboxgl.accessToken = this.config.mapboxAccessToken;
        this.map = new mapboxgl.Map({
            attributionControl: false,
            container: wrapper, // container id
            center: this.config.position, // starting position [lng, lat]
            zoom: this.config.zoom // starting zoom
        });

        this.map.setStyle('mapbox://styles/mapbox/dark-v9');
        this.map.addControl(new mapboxgl.AttributionControl({
            compact: true
        }));

        var self = this;
        setTimeout(function () {
            self.map.resize();
        }, 1000);

        return wrapper;
    }
})
;
