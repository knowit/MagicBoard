/* Magic Mirror
 * Module: entur
 */

Module.register("MMM-entur", {
    // Default module config.
    defaults: {
        position: [0, 0],
        max_distance: 500,
        zoom: 16,
        mapboxAccessToken: "",
        citybikeUpdateInterval: 1000 * 60,
        publicTransportUpdateInterval: 1000 * 60,
        publicTransportLineRotationSpeed: 20
    },

    getStyles: function () {
        return ["MMM-entur.css", "https://api.tiles.mapbox.com/mapbox-gl-js/v0.49.0/mapbox-gl.css"];
    },

    getScripts: function () {
        return ["https://api.tiles.mapbox.com/mapbox-gl-js/v0.49.0/mapbox-gl.js", "EnturBoard.js"];
    },

    getTranslations: function () {
        return {
            en: "translations/en.json",
            no: "translations/no.json",
        };
    },

    start: function () {
        console.log(this.translate("STARTINGMODULE") + ": " + this.name);
        this.updateDom();
        this.addImages();

        this.popups = [];
        this.enturBoards = [];
        this.fetchPublicTransportData();
        this.fetchCitybikeData();
    },

    fetchCitybikeData: function () {
        this.sendSocketNotification("GET_CITY_BIKE_DATA", {
            longitude: this.config.position[0],
            latitude: this.config.position[1],
            max_distance: this.config.max_distance
        })
    },

    fetchPublicTransportData: function () {
        this.sendSocketNotification("GET_ENTUR_DATA", {
            longitude: this.config.position[0],
            latitude: this.config.position[1],
            max_distance: this.config.max_distance
        })
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "ENTUR_DATA") {
            this.popups.length === 0 ? this.addPublicTransportToMap(payload) : this.updatePublicTransportMap(payload);
        }

        if (notification === "CITY_BIKE_DATA") {
            this.map.getLayer('citybikeStations') === undefined ? this.addCitybikesToMap(payload) : this.updateCitybikeMap(payload);
        }
    },

    addImages: function () {
        const self = this;
        const path = 'modules/MMM-entur/img/';
        const pictureList = ["bus.png", "citybike.png", "metro.png", "mixed.png", "tram.png", "water.png", "rail.png"];

        pictureList.forEach(function (picture) {
            self.map.loadImage(path + picture, function (error, image) {
                if (error) throw error;
                self.map.addImage(picture.substring(0, picture.length - 4), image);
            });
        });
    },

    addPublicTransportToMap: function (enturData) {
        this.publicTransportInterval = setInterval(function () {
            self.fetchPublicTransportData()
        }, this.config.publicTransportUpdateInterval);

        const self = this;
        const features = enturData["stations"]["features"];

        Object.entries(features).forEach(([key, value]) => {
            let enturBoard = new EnturBoard(this.config.publicTransportLineRotationSpeed);
            enturBoard.init(key, value);
            let popup = new mapboxgl.Popup({closeOnClick: false})
                .setLngLat(enturBoard.getCoordinates())
                .setDOMContent(enturBoard.getWrapper())
                .addTo(self.map);


            this.enturBoards.push(enturBoard);
            this.popups.push(popup);
        });
    },

    updatePublicTransportMap: function (enturData) {
        const features = enturData["stations"]["features"];
        Object.entries(features).forEach(([key, value]) => this.enturBoards[key].update(key, value));
    },

    removePublicTransportLayer: function () {
        clearInterval(this.publicTransportInterval);

        this.popups.forEach(function (popup) {
            popup.remove();
        });

        this.popups = [];
        this.enturBoards = [];
    },

    addCitybikesToMap: function (geojson) {
        const stations = geojson["stations"];
        this.map.addLayer({
            "id": "citybikeStations",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": stations
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

        this.showCitybikeLayer();
    },

    updateCitybikeMap: function (geojson) {
        console.log("UPDATING CITYBIKE DATA");
        this.map.getSource('citybikeStations').setData(geojson["stations"]);
    },

    hideCitybikeLayer: function () {
        clearInterval(this.citybikeInterval);
        this.map.setLayoutProperty('citybikeStations', 'visibility', 'none');
    },

    showCitybikeLayer: function () {
        this.citybikeInterval = setInterval(function () {
            self.fetchCitybikeData();
        }, this.config.citybikeUpdateInterval);
        this.map.setLayoutProperty('citybikeStations', 'visibility', 'visible');
    },

    getDom: function () {
        let wrapper = document.createElement("div");
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

        const self = this;
        setTimeout(function () {
            self.map.resize();
        }, 1000);

        return wrapper;
    }
});