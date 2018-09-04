/* Magic Mirror
 * Module: OsloCityBike
 *
 * By Tobias Lønnerød Madsen (https://github.com/TobbenTM)
 * Based on MMM-Ruter by Cato Antonsen (https://github.com/CatoAntonsen)
 * MIT Licensed.
 */
 
Module.register("MMM-OsloCityBike",{

	// Default module config.
	defaults: {
		serviceReloadInterval: 60000, 	// Refresh rate in MS for how often we call Ruter's web service. NB! Don't set it too low! (default is 60 seconds)
		timeReloadInterval: 1000, 		// Refresh rate how often we check if we need to update the time shown on the mirror (default is every second)
		animationSpeed: 0,				// How fast the animation changes when updating mirror (default is 0 second)
		fade: true,						// Set this to true to fade list from light to dark. (default is true)
		fadePoint: 0.25					// Start on 1/4th of the list. 
	},

	getStyles: function () {
		return ["ruter.css"];
	},

	getTranslations: function() {
		return {
			en: "translations/en.json",
			nb: "translations/nb.json"
		}
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
			
			var table = document.createElement("table");
			table.className = "ruter medium";
			
			table.appendChild(this.getTableHeaderRow());
			
			for(var i = 0; i < this.stations.length; i++) {
				var station = this.stations[i];
				var tr = this.getTableRow(station);
				
				table.appendChild(tr);
			}
			
			return table;
		} else {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "small dimmed";
		}

		return wrapper;
	},

	startPolling: function() {
		var self = this;

		var request = new Promise((resolve) => {
			this.getStations((res) => resolve(res));
		})
		.then((result) => {
			self.stations = result;
			this.updateDom(this.config.animationSpeed);
		});
	},

	getStations: function(callback) {
		var HttpClient = function() {
			this.get = function(requestUrl, requestCallback) {
				var httpRequest = new XMLHttpRequest();
				httpRequest.onreadystatechange = function() { 
					if (httpRequest.readyState == 4 && httpRequest.status == 200)
						requestCallback(httpRequest.responseText);
				}

				httpRequest.open( "GET", requestUrl, true );            
				httpRequest.send( null );
			}
		}
		
		var conf = this.config;
		var url = `https://reisapi.ruter.no/Place/GetCityBikeStations?longmin=${conf.long.min}&longmax=${conf.long.max}&latmin=${conf.lat.min}&latmax=${conf.lat.max}`;
		
		var client = new HttpClient();

		client.get(url, function(response) {
			callback(JSON.parse(response))		
		});
	},
	
	getTableHeaderRow: function() {
		var thStation = document.createElement("th");
		thStation.className = "light";
		thStation.appendChild(document.createTextNode(this.translate("STATIONHEADER")));

		var thBikes = document.createElement("th");
		thBikes.className = "light";
		thBikes.appendChild(document.createTextNode(this.translate("BIKEHEADER")));

		var thead = document.createElement("thead");
		thead.addClass = "xsmall dimmed";
		thead.appendChild(thStation);
		thead.appendChild(thBikes);
		
		return thead;
	},
	
	getTableRow: function(station) {
		var tdStation = document.createElement("td");
		tdStation.className = "station";
		tdStation.appendChild(document.createTextNode(station.Title));
		
		var tdBikes = document.createElement("td");
		tdBikes.className = "destination bright";
		tdBikes.appendChild(document.createTextNode(station.Availability.Bikes));
		
		var tr = document.createElement("tr");
		tr.appendChild(tdStation);
		tr.appendChild(tdBikes);
		
		return tr;
	}
});
