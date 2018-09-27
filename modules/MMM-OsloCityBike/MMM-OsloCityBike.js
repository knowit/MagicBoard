/* Magic Mirror
 * Module: OsloCityBike
 *
 * By Tobias Lønnerød Madsen (https://github.com/TobbenTM)
 * Based on MMM-Ruter by Cato Antonsen (https://github.com/CatoAntonsen)
 * MIT Licensed.
 */

Module.register("MMM-OsloCityBike", {
	// Default module config.
	defaults: {
		serviceReloadInterval: 60000, // Refresh rate in MS for how often we call Ruter's web service. NB! Don't set it too low! (default is 60 seconds)
		timeReloadInterval: 1000, // Refresh rate how often we check if we need to update the time shown on the mirror (default is every second)
		animationSpeed: 0, // How fast the animation changes when updating mirror (default is 0 second)
		fade: true, // Set this to true to fade list from light to dark. (default is true)
		fadePoint: 0.25, // Start on 1/4th of the list.
	},

	getStyles: function() {
		return ["MMM-OsloCityBike.css"];
	},

	getTranslations: function() {
		return {
			en: "translations/en.json",
			nb: "translations/nb.json",
		};
	},

	start: function() {
		console.log(this.translate("STARTINGMODULE") + ": " + this.name);

		this.stations = [];
		var self = this;

		// Just to an initial poll. Otherwise we have to wait for the serviceReloadInterval
		self.startPolling();

		setInterval(function() {
			self.startPolling();
		}, this.config.serviceReloadInterval);
	},

	getDom: function() {
		if (this.stations && this.stations.length > 0) {
			var wrapper = document.createElement("div");
			wrapper.className = "center column container";

			for (var i = 0; i < this.stations.length; i++) {
				var station = this.stations[i];
				var st = this.getStationRow(station);
				var bike = this.getBikeAvailableRow(station);

				wrapper.appendChild(st);
				wrapper.appendChild(bike);
			}

			wrapper.appendChild(this.getFooterRow());

			return wrapper;
		} else {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "small dimmed";
		}

		return wrapper;
	},

	startPolling: function() {
		var self = this;

		var request = new Promise(resolve => {
			this.getStations(res => resolve(res));
		}).then(result => {
			self.stations = result;
			this.updateDom(this.config.animationSpeed);
		});
	},

	getStations: function(callback) {
		var HttpClient = function() {
			this.get = function(requestUrl, requestCallback) {
				var httpRequest = new XMLHttpRequest();
				httpRequest.onreadystatechange = function() {
					if (
						httpRequest.readyState == 4 &&
						httpRequest.status == 200
					)
						requestCallback(httpRequest.responseText);
				};

				httpRequest.open("GET", requestUrl, true);
				httpRequest.send(null);
			};
		};

		var conf = this.config;
		var url = `https://reisapi.ruter.no/Place/GetCityBikeStations?longmin=${
			conf.long.min
		}&longmax=${conf.long.max}&latmin=${conf.lat.min}&latmax=${
			conf.lat.max
		}`;

		var client = new HttpClient();

		client.get(url, function(response) {
			callback(JSON.parse(response));
		});
	},

	getFooterRow: function() {
		var footer = document.createElement("div");
		footer.className = "light small";
		footer.innerHTML = this.translate("BIKEHEADER");
		return footer;
	},

	getStationRow: function(station) {
		var tdStation = document.createElement("div");
		tdStation.className = "station medium";
		tdStation.appendChild(document.createTextNode(station.Title));

		return tdStation;
	},

	getBikeAvailableRow: function(station) {
		var tdBikes = document.createElement("div");
		tdBikes.className = "destination bright large";
		tdBikes.appendChild(
			document.createTextNode(station.Availability.Bikes),
		);

		return tdBikes;
	},
});
