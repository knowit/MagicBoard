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
        updateInterval: 1000 * 60 * 2,
        publicTransportLineRotationSpeed: 40

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

        this.updateDom();

        this.addImages();

        this.sendSocketNotification("GET_ENTUR_DATA", {
            longitude: this.config.position[0],
            latitude: this.config.position[1],
            max_distance: this.config.max_distance
        });

        /*this.sendSocketNotification("GET_CITY_BIKE_DATA", {
            longitude: this.config.position[0],
            latitude: this.config.position[1],
            max_distance: this.config.max_distance
        });*/
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "ENTUR_DATA") {
            this.data = payload;
            this.addPublicTransportToMap();

            console.log(payload);

        }

        if (notification === "CITY_BIKE_DATA") {
            this.data = payload;
            this.addCitybikesToMap();
        }
    },

    addImages: function () {
        const self = this;
        const path = 'modules/MMM-entur/img/';
        const pictureList = ["bus.png", "citybike.png", "metro.png", "mixed.png", "tram.png", "water.png", "rail.png"];

        for (const pic in pictureList) {
            self.map.loadImage(path + pictureList[pic], function (error, image) {
                if (error) throw error;
                self.map.addImage(pictureList[pic].substring(0, pictureList[pic].length - 4), image);
            });
        }
    },

    addPublicTransportToMap: function () {
        this.popups = [];
        const geojson = this.data["stations"];
        const features = geojson["features"];
        const icon_size = 20;

        Object.entries(features).forEach(([key, value]) => {
            const self = this;
            const coordinates = value["geometry"]["coordinates"];
            const station_name = value["properties"]["title"];
            const lines = value["properties"]["lines"];

            let wrapper = document.createElement("div");
            wrapper.innerText = station_name;

            let next_line_wrapper = document.createElement("tr");
            next_line_wrapper.className = "lines";

            let lines_div = document.createElement("div");
            lines_div.className = "lines";

            let lines_wrapper = document.createElement("tr");
            lines_wrapper.style.position = "relative";

            let line_info_wrapper_array = [];

            for (let line in lines) {
                const transport_mode = lines[line]["transport_mode"];
                let icon = document.createElement("img");
                icon.src = "modules/MMM-entur/img/" + transport_mode + "_black.png";
                icon.style.width = icon_size + "px";
                icon.style.height = icon_size + "px";

                const line_info = lines[line]["public_code"] + " " + lines[line]["name"];
                let line_info_wrapper = document.createElement("div");
                line_info_wrapper.innerText = line_info;
                line_info_wrapper.style.marginRight = "20px";

                if (line == 0) {
                    next_line_wrapper.appendChild(icon);
                    next_line_wrapper.appendChild(line_info_wrapper);
                    wrapper.appendChild(next_line_wrapper);
                }
                else{
                    line_info_wrapper_array.push(line_info_wrapper);
                    lines_wrapper.appendChild(icon);
                    lines_wrapper.appendChild(line_info_wrapper);
                }
            }

            lines_div.appendChild(lines_wrapper);
            wrapper.appendChild(lines_div);

            this.popups.push(new mapboxgl.Popup({closeOnClick: false})
                .setLngLat(coordinates)
                .setDOMContent(wrapper)
                .addTo(self.map));

            let total_width = 0;
            for (var index in line_info_wrapper_array){
                total_width += line_info_wrapper_array[index].offsetWidth + icon_size;
            }


            let pos = 0;
            const id = setInterval(frame, this.config.publicTransportLineRotationSpeed);
            function frame() {
                if (pos >= total_width) {
                    pos = 0;
                } else {
                    pos++;
                    lines_wrapper.style.left = -pos + 'px';
                }
            }
        });
    },

    addCitybikesToMap: function () {
        const geojson = this.data["stations"];
        this.map.addLayer({
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

    },

    removePublicTransportLayer: function () {
        for(let index in this.popups){
            this.popups[index].remove();
        }
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
})
;
