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
        effect: "slide-center",
        // notice, warning, error, success
        // will add class ns-type-warning, ns-type-error or ns-type-success
        type: "notice",
        // if the user doesn´t close the notification then we remove it
        // after the following time
        ttl: 6000,
        al_no: "ns-alert", //"ns-box"
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
        this.active = false;

        // create HTML structure
        this.ntf = document.createElement("div");
        this.ntf.style.backgroundColor = "maroon";
        this.ntf.className = this.options.al_no + " ns-" + this.options.layout + " ns-effect-" + this.options.effect + " ns-type-" + this.options.type;
        this.ntf.innerHTML = "<span class='light' style='font-size:28px;line-height: 30px;'>" + "Facial Recognition On" + "</span>";

        // append to body or the element specified in options.wrapper
        this.options.wrapper.insertBefore(this.ntf, this.options.wrapper.nextSibling);
    };

    /**
     * init events
     */

    WebcamNotification.prototype.toggleOnOff = function () {
        if (this.active) {
            this.dismiss();
        } else {
            this.show();
        }
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
