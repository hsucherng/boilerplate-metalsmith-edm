/*
 * Usage:
 *
 *      .use(run({
 *          condition: function(files, metalsmith, done) {
 *              /*
 *               * Do whatever's needed, then return
 *               * a truthy value to run the plugin,
 *               * or return a falsey value to ignore
 *               * the plugin.
 *               *//*
 *
 *              return true;
 *          },
 *          plugin: plugin()
 *      }))
 *
 */
const debug = require('debug')('metalsmith-run');

module.exports = function(options) {
    if(typeof options.condition !== 'function') {
        debug('Missing condition function.');

        return function(files, metalsmith, done) {
            done();
        };
    }

    if(typeof options.plugin !== 'function') {
        debug('Missing plugin function.');

        return function(files, metalsmith, done) {
            done();
        };
    }

    return function(files, metalsmith, done) {
        if(options.condition.apply(null, arguments)) {
            options.plugin.apply(null, arguments);
        } else {
            done();
        }
    };
};