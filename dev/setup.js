/* Modules from npm */
const Metalsmith = require('metalsmith');
const colors     = require('colors/safe');
const minimatch  = require('minimatch');
const path       = require('path');
const prompt     = require('prompt');

/* Configs */
const configs = {
        express: require('./configs/express.js')
    };

/* Starting the entire setup process */

console.log(`\r\n${ colors.green.bold('Starting setup...') }\r\n`);

/* Starting Metalsmith */

Metalsmith(__dirname)
    .source('./')
    .destination('./')
    .ignore('**/node_modules/**')
    .ignore('**/setup.js')
    .ignore('**/build/**')
    .frontmatter(false)
    .clean(false)
    // .source('src')
    // .destination('build')

    .use(function(files, metalsmith, done) {
        let finalPromptResult = {};
        let updatedFiles = [];

        prompt.addProperties(
            finalPromptResult,
            [
                {
                    name: 'edmName',
                    description: colors.yellow.bold(`EDM name`),
                    required: true,
                    message: 'EDM name is required.'
                }
            ],
            function() {
                let buildFolderName = finalPromptResult.edmName
                                        .toLowerCase()
                                        .replace(new RegExp('[^A-Za-z-\\s\\d]', 'g'), '') // Only allow letters, spaces, digits and dashes
                                        .replace(new RegExp('\\s', 'g'), '-'); // Replace spaces with dashes

                prompt.addProperties(
                    finalPromptResult,
                    [
                        {
                            name: 'virtualFolderName',
                            description:
                                `${ colors.yellow.bold(`Virtual folder name`) }
    - Default value is '${ buildFolderName }\', which will lead to the site being served on '${configs.express.host}:${configs.express.port}/${ buildFolderName }/'.
    - Leave blank to use the default value.
    - Type 'n' if you just want the site to be served on '${configs.express.host}:${configs.express.port}/')
`,
                            pattern: /^[A-Za-z-\\d-]+$/, // Only allow letters, digits and dashes
                            message: 'Virtual folder name must be only letters, digits, or dashes.',
                            before: function(value) {
                                if(value === '') {
                                    return buildFolderName;
                                } else if(value.toLowerCase() === 'n') {
                                    return '';
                                } else {
                                    return value;
                                }
                            }
                        }
                    ],
                    function() {
                        /*---- Setup files as necessary ----*/

                        let filepaths = [
                                path.normalize('README.md'),
                                path.normalize('templates/default.njk'),
                                path.normalize('src/assets/scss/style.scss'),
                                path.normalize('configs/misc.js'),
                            ];
                        let replace = {
                                'EDM-NAME': finalPromptResult.edmName,
                                'VIRTUAL-FOLDER-NAME': finalPromptResult.virtualFolderName
                            };

                        filepaths.forEach((filepath, index) => {
                            let contents = files[filepath].contents.toString();
                            let hasUpdate = false;

                            for(let i in replace) {
                                contents = contents.replace(new RegExp(i, 'g'), function(match) {
                                    if(!hasUpdate) {
                                        hasUpdate = true;
                                        updatedFiles.push(filepath);
                                    }

                                    return replace[i];
                                });
                            }

                            files[filepath].contents = Buffer.from(contents);
                        });

                        /*---- Disable setup warning for build command ----*/

                        let miscConfigFilepath = path.normalize('configs/misc.js');
                        let miscConfigFile = files[miscConfigFilepath];
                        let miscConfigContents = miscConfigFile.contents.toString();

                        miscConfigContents = miscConfigContents.replace('setupComplete: false', function(match) {
                            if(updatedFiles.indexOf(miscConfigFilepath) < 0) {
                                updatedFiles.push(miscConfigFilepath);
                            }

                            return 'setupComplete: true';
                        });

                        miscConfigFile.contents = Buffer.from(miscConfigContents);

                        /*---- Log all updated files ----*/

                        if(updatedFiles.length) {
                            console.log('\r\nThe following files have been updated:')

                            for(let i = 0; i < updatedFiles.length; i++) {
                                console.log(colors.yellow(updatedFiles[i]));
                            }
                        } else {
                            console.log(colors.yellow('No files have been updated.'));
                        }

                        done();
                    }
                )
            }
        );
    })

    /* END! */
    .build(function(err, files) {
        if(err) {
            console.error(`\r\n${ colors.red(err) }`);
            return;
        }

        console.log(`\r\n${ colors.green.bold('Setup complete!') }`);
    });
