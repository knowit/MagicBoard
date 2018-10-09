/* global Module */

Module.register('MMM-Boards', {

    defaults: {
        updateInterval: 1000 * 60,   //  Changes board every 60 seconds
        fadeSpeed: 1000 * 2,    //  Fade in and out time
    },

    start: function () {
        console.log("Starting module: " + this.name);

        this.currentBoardNumber = 0;
        this.numberOfBoards = 1;
    },

    notificationReceived: function (notification, payload, sender) {
        if(notification === "KEYPRESS"){
            const self = this;
            switch (payload.KeyName) {
                case "ArrowRight":
                    self.selectBoard(1);
                    break;
                case "ArrowLeft":
                    self.selectBoard(-1);
                    break;
                default:
                    break;
            }
        }

        if(notification === "NEXT_BOARD"){
            this.selectBoard(1);
        }

        if(notification === "PREVIOUS_BOARD"){
            this.selectBoard(-1);
        }

        //  Selects first board to be shown when all doms are created. Starts the updatetimer.
       else if (notification === 'DOM_OBJECTS_CREATED') {
            const self = this;
            let modules = MM.getModules();

            //  Gets number of boards
            for (let m in modules) {
                if (typeof modules[m].data.board !== "undefined") {
                    if (modules[m].data.board + 1 > self.numberOfBoards) {
                        self.numberOfBoards = modules[m].data.board + 1;
                    }
                }
            }

            if (self.numberOfBoards > 1) {
                self.selectBoard(0);
                setInterval(function () {
                    self.selectBoard(1);
                }, self.config.updateInterval);
            }
        }
    },

    //  Function: Selects the next board to be shown.
    selectBoard: function(boardNumberChange){
      this.currentBoardNumber += boardNumberChange;
      if(this.currentBoardNumber >= this.numberOfBoards){
          this.currentBoardNumber = 0;
      }
      else if(this.currentBoardNumber < 0){
          this.currentBoardNumber = this.numberOfBoards - 1;
      }

      this.rotateBoards();
    },

    //  Function: Rotates board by hiding all modules, then showing the modules on the current board
    rotateBoards: function() {
        const self = this;
        let modules = MM.getModules();
        const callback = function () {
        };
        const options = {lockString: self.identifier};

        //  Hides all modules
        for (let m in modules) {
            if (typeof modules[m].data.board !== "undefined") {
                modules[m].hide(self.config.fadeSpeed, callback, options);
            }
        }

        //  Waits until all modules are hidden before showing current board
        setTimeout(function () {
            for (let m in modules) {
                if (typeof modules[m].data.board !== "undefined" && modules[m].data.board === self.currentBoardNumber) {
                    modules[m].show(self.config.fadeSpeed, callback, options);
                }
            }
        }, self.config.fadeSpeed);
    },
});