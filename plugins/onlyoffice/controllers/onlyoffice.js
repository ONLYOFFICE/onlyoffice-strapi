'use strict';

/**
 * onlyoffice.js controller
 *
 * @description: A set of functions called "actions" of the `onlyoffice` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  }
};
