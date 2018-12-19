const argv = require('../custom-modules/argv.js');

module.exports = {
    paths: {
        "${source}/**/*.+(scss|njk)": '**/*.+(njk|scss)',
        "${source}/**/*.!(scss|njk)": true,
        "templates/**/*": "**/*.njk"
    },
    livereload: !argv('--dist')
};