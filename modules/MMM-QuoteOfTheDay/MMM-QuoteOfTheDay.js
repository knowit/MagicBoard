Module.register("MMM-QuoteOfTheDay",{
	// Default module config.
	defaults: {
        updateInterval: 60000 * 3,
		fadeSpeed: 4000,
    },
    
    start: function() {
		Log.info("Starting module: " + this.name);

        this.currentQuote;
		var self = this;
        self.startPolling();

        setInterval(function() {
			self.startPolling();
		}, this.config.updateInterval);
    },

    startPolling: function() {
		var self = this;

		var response = new Promise((resolve) => {
			this.getQuote((res) => resolve(res));
		})
		.then((result) => {
			self.currentQuote = result;
			this.updateDom(this.config.fadeSpeed);
		});
    },
    
    getQuote: function(callback) {
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
        
		var url = "https://talaikis.com/api/quotes/random/";
		var client = new HttpClient();

		client.get(url, function(response) {
			callback(JSON.parse(response))
		});
    },

    getDom: function() {
		if (this.currentQuote !== undefined) {
            var title = document.createElement("div");
			title.className = "italic xlarge bright spacing";
            var quote = document.createTextNode("\"" + this.currentQuote.quote + "\"");
            title.appendChild(quote);

            var newline = document.createElement("br");
            title.appendChild(newline)
            
            var sub = document.createElement("div");
            sub.className = "medium bright"
			var author = document.createTextNode("by " + this.currentQuote.author)
			
			var wrapper = document.createElement("div");
			wrapper.appendChild(title)
            wrapper.appendChild(author)

		    return wrapper;

		} else {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = "Loading ...";
			wrapper.className = "small dimmed";
		}

		return wrapper;
	},

});