/**
 * notificationFx.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
// jscs:disable

;(function (window) {

    "use strict";

    var docElem = window.document.documentElement,
        support = {animations: Modernizr.cssanimations},
        animEndEventNames = {
            "WebkitAnimation": "webkitAnimationEnd",
            "OAnimation": "oAnimationEnd",
            "msAnimation": "MSAnimationEnd",
            "animation": "animationend"
        },
        // animation end event name
        animEndEventName = animEndEventNames[Modernizr.prefixed("animation")];

    /**
     * NotificationFx function
     */
    function WebcamNotification() {
        this._init();
    }

    /**
     * NotificationFx options
     */
    WebcamNotification.prototype.options = {
        // element to which the notification will be appended
        // defaults to the document.body
        wrapper: document.body,
        // the message
        message: "yo!",
        // layout type: growl|attached|bar|other
        layout: "growl",
        // effects for the specified layout:
        // for growl layout: scale|slide|genie|jelly
        // for attached layout: flip|bouncyflip
        // for other layout: boxspinner|cornerexpand|loadingcircle|thumbslider
        // ...
        effect: "slide",
        // notice, warning, error, success
        // will add class ns-type-warning, ns-type-error or ns-type-success
        type: "notice",
        // if the user doesn´t close the notification then we remove it
        // after the following time
        ttl: 6000,
        al_no: "ns-alert",
        // callbacks
        onClose: function () {
            return false;
        },
        onOpen: function () {
            return false;
        }
    };

    /**
     * init function
     * initialize and cache some vars
     */
    WebcamNotification.prototype._init = function () {
        var wrapper = document.createElement("div");

        let camera = document.createElement("div");
        let counter = document.createElement("div")
        counter.style = "text-align: center; padding-bottom: 10px;";
        counter.className = "large normal";

        camera.appendChild(counter);
        let cameraPreview = document.createElement("div");
        camera.appendChild(cameraPreview);
        let snapshot = document.createElement("div");
        camera.appendChild(snapshot)
        let commands = document.createElement("div");
        commands.innerHTML = "Test";
        commands.className = "small light dimmed";
        commands.style = "padding-top: 10px;"
        camera.appendChild(commands);

        wrapper.appendChild(camera);

        Webcam.set({
            width: 640,
            height: 480,
            image_format: 'jpeg',
            jpeg_quality: 90,
            constraints: {
                mandatory: {
                    minWidth: 640,
                    minHeight: 480
                },
                optional: [
                    { minFrameRate: 60 }
                ]
            }
        });

        Webcam.attach(cameraPreview);

        // create HTML structure
        this.ntf = document.createElement("div");
        this.ntf.className = this.options.al_no + " ns-" + this.options.layout + " ns-effect-" + this.options.effect + " ns-type-" + this.options.type;
        this.ntf.appendChild(wrapper);

        // append to body or the element specified in options.wrapper
        this.options.wrapper.insertBefore(this.ntf, this.options.wrapper.nextSibling);

        // dismiss after [options.ttl]ms
        var self = this;
        if (this.options.ttl) {
            this.dismissttl = setTimeout(function () {
                if (self.active) {
                    self.dismiss();
                }
            }, this.options.ttl);
        }

        // init events*/
        this._initEvents();
    };

    /**
     * init events
     */
    WebcamNotification.prototype._initEvents = function () {
        var self = this;
        // dismiss notification by tapping on it if someone has a touchscreen
        this.ntf.querySelector(".ns-box-inner").addEventListener("click", function () {
            self.dismiss();
        });
    };

    /**
     * show the notification
     */
    WebcamNotification.prototype.show = function () {
        this.active = true;
        classie.remove(this.ntf, "ns-hide");
        classie.add(this.ntf, "ns-show");
        this.options.onOpen();
    };

    /**
     * dismiss the notification
     */
    WebcamNotification.prototype.dismiss = function () {
        var self = this;
        this.active = false;
        clearTimeout(this.dismissttl);
        classie.remove(this.ntf, "ns-show");
        setTimeout(function () {
            classie.add(self.ntf, "ns-hide");

            // callback
            self.options.onClose();
        }, 25);

        // after animation ends remove ntf from the DOM
        var onEndAnimationFn = function (ev) {
            if (support.animations) {
                if (ev.target !== self.ntf) return false;
                this.removeEventListener(animEndEventName, onEndAnimationFn);
            }

            if (this.parentNode === self.options.wrapper) {
                self.options.wrapper.removeChild(this);
            }
        };

        if (support.animations) {
            this.ntf.addEventListener(animEndEventName, onEndAnimationFn);
        } else {
            onEndAnimationFn();
        }
    };

    /**
     * add to global namespace
     */
    window.WebcamNotification = WebcamNotification;

})(window);
