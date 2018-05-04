const argv = require('../custom-modules/argv.js');

module.exports = {
    paths: {
        "${source}/*": "*",
        "${source}/*/**": true,
    },
    livereload: !argv('--dist')
};