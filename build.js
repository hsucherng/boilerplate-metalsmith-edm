/* Modules from npm */
const Metalsmith     = require('metalsmith');
const express        = require('metalsmith-express');
const inlineCss      = require('inline-css');
const multimatch     = require('multimatch');
const open           = require('open');
const postcss        = require('metalsmith-with-postcss');
const postcssScss    = require('postcss-scss');
const sass           = require('metalsmith-sass');
const watch          = require('metalsmith-watch');

/* Custom modules */
const argv           = require('./custom-modules/argv.js');
const run            = require('./custom-modules/metalsmith-run.js');
const virtualFolder  = require('./custom-modules/metalsmith-virtual-folder.js');

/* Configs */
const configs = {
        express:     require('./configs/express.js'),
        misc:        require('./configs/misc.js'),
        stylelint:   require('./configs/stylelint.js'),
        watch:       require('./configs/watch.js')
    };

/* Starting the entire build process */

console.log('Building...');

/* Starting Metalsmith */

Metalsmith(__dirname)
    .source('src')
    .destination('build')

    /* CSS */
    .use(postcss({
        pattern: ['**/*.scss'],
        syntax: postcssScss,
        plugins: {
            "stylelint": {
                config: configs.stylelint
            },
            "autoprefixer": {},
            "postcss-reporter": {}
        }
    }))
    .use(sass({
        outputStyle: "expanded",
        outputDir: function(originalPath) {
            return originalPath.replace('scss', 'css');
        }
    }))

    /* CSS Inliner */
    .use(function(files, metalsmith, done) {
        const targetFiles = multimatch(Object.keys(files), ['**/*.html']);
        const total = targetFiles.length;
        let count = 0;
        let stepFn = function() {
                count++;

                if(count >= total) {
                    done();
                    stepFn = function() {};
                }
            };

        if(!targetFiles.length) {
            done();
            return;
        }

        targetFiles.forEach(function(filepath, index) {
            const splitFilepath = filepath.split('\\');
            const folderPath = (splitFilepath.length > 1)
                                ? splitFilepath.slice(0, splitFilepath.length-1).join('\\')
                                : '';
            const file = files[filepath];
            const fileContents = file.contents.toString();
            const cssFilename = file.inlineCss;
            const cssFilepath = (folderPath)
                                ? folderPath + '\\' + cssFilename
                                : cssFilename;

            if(!files[cssFilepath]) {
                console.error(`Unable to find CSS file ${cssFilepath}.`);
                stepFn();
                return;
            }

            const cssContents = files[cssFilepath].contents.toString();

            inlineCss(fileContents, {
                extraCss: cssContents,
                removeHtmlSelectors: false,
                url: ' '
            }).then(function(html) {
                file.contents = html;
                delete files[cssFilepath];
                stepFn();
            });
        });
    })

    /* Virtual folder */
    .use(virtualFolder(configs.misc.virtualFolder))

    /* Watch and serve */
    .use(run({
        condition: function(files, metalsmith, done) {
            return !argv('--dist');
        },
        plugin: express(configs.express)
    }))
    .use(run({
        condition: function(files, metalsmith, done) {
            return !argv('--dist');
        },
        plugin: watch(configs.watch)
    }))

    /* END! */
    .build(function(err, files) {
        if(err) {
            console.error(err);
            return;
        }

        console.log('Build complete!');

        if(argv('--open')) {
            open(`http://${configs.express.host}:${configs.express.port}/${configs.misc.virtualFolder}`);
        }
    });
