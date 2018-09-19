Module.register("MMM-SimpleLogo", {
    // Default module config.
    defaults: {
        text: "",
        fileUrl: "modules/MMM-SimpleLogo/public/logo.png",
        width: "200px",
        position: "left",
        refreshInterval: 0
    },

    start: function() {
        if (this.config.refreshInterval > 0) {
            var self = this;
            var imgsrc = self.config.fileUrl;
            setInterval(function() {
                img = document.querySelector(".simple-logo__container img[src*='" + imgsrc + "']");
                imgsrc = self.config.fileUrl;
		if(!imgsrc.includes("?"))
			imgsrc += '?' + Date.now();
		else
			imgsrc += '&' + Date.now();
                img.setAttribute('src', imgsrc);
            }, this.config.refreshInterval);
        }
    },

    getStyles: function () {
        return [
            this.file('css/mmm-simplelogo.css')
        ];
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = 'simple-logo__container';
        wrapper.classList.add(this.config.position);
        wrapper.style.width = this.config.width;
        var text = document.createTextNode(this.config.text);
        wrapper.appendChild(text);
        var img = document.createElement("img");
        img.setAttribute('src', this.config.fileUrl);
        wrapper.appendChild(img);
        return wrapper;
    }
});