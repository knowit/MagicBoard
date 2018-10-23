let EnturBoard = function (publicTransportLineRotationSpeed) {
        this.wrapper = document.createElement("div");
        this.linesDiv = document.createElement("div");
        this.nextLineWrapper = document.createElement("tr");
        this.lines = [];
        this.coordinates = [];
        this.iconSize = 20;
        this.marginSize = 20;
        this.interval = null;

        EnturBoard.prototype.init = function (key, geojson){
            const stationName = geojson["properties"]["title"];
            this.coordinates = geojson["geometry"]["coordinates"];

            this.wrapper.className = "station-name";
            this.wrapper.innerText = stationName;

            this.nextLineWrapper.className = "lines";
            this.linesDiv.className = "lines";

            this.update(key, geojson);
        };


        EnturBoard.prototype.update = function (key, geojson) {
            while (this.linesDiv.firstChild) {
                this.linesDiv.removeChild(this.linesDiv.firstChild);
            }
            while (this.nextLineWrapper.firstChild) {
                this.nextLineWrapper.removeChild(this.nextLineWrapper.firstChild);
            }

            const self = this;
            const currentTime = new Date();
            const linesJson = geojson["properties"]["lines"];

            let linesWrapper = document.createElement("tr");
            linesWrapper.style.position = "relative";

            linesJson.forEach(function(line) {
                const transportMode = line["transport_mode"];
                let icon = document.createElement("img");
                icon.src = "modules/MMM-entur/img/" + transportMode + "_black.png";
                icon.style.width = self.iconSize + "px";
                icon.style.height = self.iconSize + "px";

                const expectedArrival = new Date(line["expected_arrival"]);
                const timeDifferenceInMinutes = Math.floor(((expectedArrival - currentTime) / 1000) / 60);

                let lineInfo = line["public_code"] + " " + line["name"] + ": ";
                lineInfo += (timeDifferenceInMinutes === 0) ? "nå" : timeDifferenceInMinutes + " min";

                let lineInfoWrapper = document.createElement("div");
                lineInfoWrapper.innerText = lineInfo;
                lineInfoWrapper.style.marginRight = self.marginSize + "px";

                if (self.nextLineWrapper.childElementCount === 0) {
                    self.nextLineWrapper.appendChild(icon);
                    self.nextLineWrapper.appendChild(lineInfoWrapper);
                    self.wrapper.appendChild(self.nextLineWrapper);
                }
                else {
                    linesWrapper.appendChild(icon);
                    linesWrapper.appendChild(lineInfoWrapper);
                    self.lines.push(lineInfoWrapper);
                }
            });

            this.linesDiv.appendChild(linesWrapper);
            this.wrapper.appendChild(this.linesDiv);

            let rotationSleep = 50;
            let pos = 0;
            let width = this.getWidth();

            if(this.interval != null) clearInterval(this.interval);
            this.interval = setInterval(function () {
                if (pos - rotationSleep >= width) {
                    pos = 0;
                    linesWrapper.style.left = pos + 'px';
                    width = self.getWidth();
                } else {
                    pos += 0.5;
                    if (pos > rotationSleep) linesWrapper.style.left = -(pos - rotationSleep) + 'px';

                }
            }, publicTransportLineRotationSpeed);
        };

        EnturBoard.prototype.getWidth = function () {
            let totalWidth = 0;
            for (let index in this.lines) totalWidth += this.iconSize + this.lines[index].offsetWidth + this.marginSize;
            return totalWidth;
        };

        EnturBoard.prototype.getWrapper = function () {
            return this.wrapper;
        };

        EnturBoard.prototype.getCoordinates = function () {
            return this.coordinates;
        };

    }
;