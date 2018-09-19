Module.register('MMM-pages', {

  // We require the older style of function declaration for compatibility
  // reasons.

  /**
   * By default, we have don't pseudo-paginate any modules. We also exclude
   * the page indicator by default, in case people actually want to use the
   * sister module. We also don't rotate out modules by default.
   */
  defaults: {
    modules: [],
    excludes: ['MMM-page-indicator'],
    animationTime: 1000,
    rotationTime: 0,
    rotationDelay: 10000
  },

  /**
   * Apply any styles, if we have any.
   */
  getStyles: function() {
    return ['pages.css'];
  },


  /**
   * Modulo that also works with negative numbers.
   *
   * @param {number} x The dividend
   * @param {number} n The divisor
   */
  mod: function(x, n) {
    return ((x % n) + n) % n;
  },

  /**
   * Pseudo-constructor for our module. Makes sure that values aren't negative,
   * and sets the default current page to 0.
   */
  start: function() {
    this.curPage = 0;

    // Disable rotation if an invalid input is given
    this.config.rotationTime = Math.max(this.config.rotationTime, 0);
    this.config.rotationDelay = Math.max(this.config.rotationDelay, 0);
  },

  /**
   * Handles incoming notifications. Responds to the following:
   *   'PAGE_CHANGED' - Set the page to the specified payload page.
   *   'PAGE_INCREMENT' - Move to the next page.
   *   'PAGE_DECREMENT' - Move to the previous page.
   *   'DOM_OBJECTS_CREATED' - Starts the module.
   *   'QUERY_PAGE_NUMBER' - Requests the current page number
   *
   * @param {string} notification the notification ID
   * @param {number} payload the page to change to/by
   */
  notificationReceived: function(notification, payload) {
    switch (notification) {
      case 'PAGE_CHANGED':
        Log.log('[Pages]: received a notification '
          + `to change to page ${payload} of type ${typeof payload}`);
        this.curPage = payload;
        this.updatePages();
        break;
      case 'PAGE_INCREMENT':
        Log.log('[Pages]: received a notification to increment pages!');
        this.changePageBy(payload, 1);
        this.updatePages();
        break;
      case 'PAGE_DECREMENT':
        Log.log('[Pages]: received a notification to decrement pages!');
        this.changePageBy(payload, -1);
        this.updatePages();
        break;
      case 'DOM_OBJECTS_CREATED':
        Log.log('[Pages]: received that all objects are created;'
          + 'will now hide things!');
        this.sendNotification('MAX_PAGES_CHANGED', this.config.modules.length);
        this.animatePageChange();
        this.resetTimerWithDelay(0);
        break;
      case 'QUERY_PAGE_NUMBER':
        this.sendNotification('PAGE_NUMBER_IS', this.curPage);
        break;
      default: // Do nothing
    }
  },
    
  /**
   * Changes the internal page number by the specified amount. If the provided
   * amount is invalid, use the fallback amount. If the fallback amount is
   * missing or invalid, do nothing.
   *
   * @param {number} amt the amount of pages to move forward by. Accepts
   * negative numbers.
   * @param {number} fallback the fallback value to use. Accepts negative
   * numbers.
   */
  changePageBy: function(amt, fallback) {
    if (typeof payload !== 'number') {
      Log.warn(`[Pages]: ${amt} is not a number!`);
    }

    if (typeof amt === 'number') {
      this.curPage = this.mod(
        this.curPage + amt,
        this.config.modules.length
      );
    } else if (typeof fallback === 'number') {
      this.curPage = this.mod(
        this.curPage + fallback,
        this.config.modules.length
      );
    }
  },

  /**
   * Handles hiding the current page's elements and showing the next page's
   * elements.
   */
  updatePages: function() {
    // Update iff there's at least one page.
    if (this.config.modules.length !== 0) {
      this.animatePageChange();
      this.resetTimerWithDelay(this.config.rotationDelay);
    } else { Log.error("[Pages]: Pages aren't properly defined!"); }
  },

  /**
   * Animates the page change from the previous page to the current one. This
   * assumes that there is a discrepancy between the page currently being shown
   * and the page that is meant to be shown.
   */
  animatePageChange: function() {
    const self = this;

    // Hides all modules not on the current page. This hides any module not
    // meant to be shown.
    MM.getModules()
      .exceptWithClass(this.config.excludes)
      .exceptWithClass(this.config.modules[this.curPage])
      .enumerate(module => module.hide(
        self.config.animationTime / 2,
        { lockString: self.identifier }
      ));

    // Shows all modules meant to be on the current page, after a small delay.
    setTimeout(() => MM.getModules()
      .withClass(self.config.modules[self.curPage])
      .enumerate(module => module.show(
        self.config.animationTime / 2,
        { lockString: self.identifier },
      )), this.config.animationTime / 2);
  },

  /**
   * Resets the page changing timer with a delay.
   *
   * @param {number} delay the delay, in milliseconds.
   */
  resetTimerWithDelay: function(delay) {
    if (this.config.rotationTime > 0) {
      // This timer is the auto rotate function.
      clearInterval(this.timer);
      // This is delay timer after manually updating.
      clearInterval(this.delayTimer);
      const self = this;

      this.delayTimer = setTimeout(() => {
        self.timer = setInterval(() => {
          self.sendNotification('PAGE_INCREMENT');
          self.changePageBy(1);
          self.updatePages();
        }, self.config.rotationTime);
      }, delay);
    }
  },
});
