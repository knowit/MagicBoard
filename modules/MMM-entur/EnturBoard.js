let EnturBoard = function (publicTransportLineRotationSpeed) {
    let wrapper = document.createElement("div");
    let linesWrapper = document.createElement("tr");
    let lines = [];
    let coordinates = [];
    let iconSize = 20;
    let marginSize = 20;

    EnturBoard.prototype.update = function (key, geojson) {
        const currentTime = new Date();
        const stationName = geojson["properties"]["title"];
        const linesJson = geojson["properties"]["lines"];
        coordinates = geojson["geometry"]["coordinates"];

        wrapper.className = "station-name";
        wrapper.innerText = stationName;

        let nextLineWrapper = document.createElement("tr");
        nextLineWrapper.className = "lines";

        let linesDiv = document.createElement("div");
        linesDiv.className = "lines";

        linesWrapper.style.position = "relative";

        for (let line in linesJson) {
            const transportMode = linesJson[line]["transport_mode"];
            let icon = document.createElement("img");
            icon.src = "modules/MMM-entur/img/" + transportMode + "_black.png";
            icon.style.width = iconSize + "px";
            icon.style.height = iconSize + "px";

            const expectedArrival = new Date(linesJson[line]["expected_arrival"]);
            const timeDifferenceInMinutes = Math.floor(((expectedArrival - currentTime) / 1000) / 60);

            let lineInfo = linesJson[line]["public_code"] + " " + linesJson[line]["name"];
            if (timeDifferenceInMinutes === 0) {
                lineInfo += ": nå";
            }
            else {
                lineInfo += ": " + timeDifferenceInMinutes + " min"
            }
            let lineInfoWrapper = document.createElement("div");
            lineInfoWrapper.innerText = lineInfo;
            lineInfoWrapper.style.marginRight = marginSize + "px";

            if (line == 0) {
                nextLineWrapper.appendChild(icon);
                nextLineWrapper.appendChild(lineInfoWrapper);
                wrapper.appendChild(nextLineWrapper);
            }
            else {
                lines.push(lineInfoWrapper);
                linesWrapper.appendChild(icon);
                linesWrapper.appendChild(lineInfoWrapper);
            }
        }

        linesDiv.appendChild(linesWrapper);
        wrapper.appendChild(linesDiv);

        let rotationSleep = 50;
        let pos = 0;
        const self = this;
        setInterval(function () {
            if (pos - rotationSleep >= self.getWidth()) {
                pos = 0;
                linesWrapper.style.left = pos + 'px';
            } else {
                pos += 0.5;
                if (pos > rotationSleep) {
                    linesWrapper.style.left = -pos + 'px';
                }
            }
        }, publicTransportLineRotationSpeed);

    };


    EnturBoard.prototype.getWidth = function () {
        let totalWidth = 0;
        for (let index in lines) {
            totalWidth += iconSize + lines[index].offsetWidth + marginSize;
        }
        return totalWidth;
    };

    EnturBoard.prototype.getWrapper = function(){
        return wrapper;
    };

    EnturBoard.prototype.getCoordinates = function(){
        return coordinates;
    };

};