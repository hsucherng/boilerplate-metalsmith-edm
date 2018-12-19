/* Modules from npm */
const Metalsmith     = require('metalsmith');
const colors         = require('colors/safe');
const express        = require('metalsmith-express');
const inlineCss      = require('inline-css');
const inPlace        = require('metalsmith-in-place');
const multimatch     = require('multimatch');
const path           = require('path');
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
        watch:       require('./configs/watch.js')
    };

/* Starting the entire build process */

if(!configs.misc.setupComplete) {
    console.log(colors.yellow.bold(`Before building, you must first complete the initial setup. You can do that by running ${ colors.green('node setup') }.`));
    return;
}

console.log(`\r\n${ colors.green.bold('Building...') }\r\n`);

/* Starting Metalsmith */

Metalsmith(__dirname)
    .source('src')
    .destination('build')

    /* CSS */
    .use(sass({
        outputStyle: "expanded",
        outputDir: function(originalPath) {
            return originalPath.replace('scss', 'css');
        }
    }))

    /* HTML */
    .use(inPlace({
        pattern: '**/*.njk',
        engineOptions: {
            path: __dirname + '/templates'
        },
        suppressNoFilesError: true
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
            const cssFilepath = file.inlineCss;
            const finalCssFilepath = path.join(folderPath, cssFilepath);

            if(!files[finalCssFilepath]) {
                console.error(`Unable to find CSS file ${finalCssFilepath}.`);
                stepFn();
                return;
            }

            const cssContents = files[finalCssFilepath].contents.toString();

            inlineCss(fileContents, {
                extraCss: cssContents,
                removeHtmlSelectors: false,
                url: ' '
            }).then(function(html) {
                file.contents = html;
                stepFn();
            });
        });
    })

    /* Remove all CSS files, as we're not allowed to use them in EDMs */
    .use(function(files, metalsmith, done) {
        const targetFiles = multimatch(Object.keys(files), ['**/*.css']);

        if(!targetFiles.length) {
            done();
        }

        targetFiles.forEach(function(filepath) {
            delete files[filepath];
        });

        done();
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
            console.error(colors.red(err));
            return;
        }

        console.log(`
${ colors.green.bold('Build complete!') }
 - Open your browser and navigate to ${ colors.yellow.bold(`http://${configs.express.host}:${configs.express.port}/${configs.misc.virtualFolder}`) } to view the site
`
        );
    });
