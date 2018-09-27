
Module.register("MMM-Boards",{
    requiresVersion: "2.1.0",
    defaults: {
        speed: 2000,
        updateInterval: 1000 * 60,
        numberOfBoards: 1,
    },

    start: function () {
        const self = this;
        this.current_board = 0;

        setInterval(function () {
            self.rotateBoards();
        }, self.config.updateInterval);
    },

    rotateBoards :function(){
        const self = this;
        const modules = MM.getModules();

        //  Hides all modules
        for (let m in modules){
            var callback = function(){};
            var options = {lockString: self.identifier};

            if (typeof modules[m].data.board === "undefined") {
                console.log("undefined");
            }
            else{
                modules[m].hide(self.config.speed, callback, options);
            }
        }

        //  Waits unitl modules are hidden before showing current board
        setTimeout(function(){
            for (let m in modules){
                var callback = function(){};
                var options = {lockString: self.identifier};

                if (typeof modules[m].data.board === "undefined") {
                    console.log("undefined");
                }
                else if (modules[m].data.board === self.current_board) {
                    modules[m].show(self.config.speed, callback, options);
                }
            }
        }, this.config.speed);

        this.current_board++;
        if(this.current_board >= self.config.numberOfBoards){
            this.current_board = 0;
        }
    },

    notificationReceived: function(notification, payload, sender){
        if (notification === 'DOM_OBJECTS_CREATED'){
            this.rotateBoards();
        }
    }
});