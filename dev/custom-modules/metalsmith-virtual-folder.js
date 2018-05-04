/*
 *  Use:
 *
 *      Metalsmith(__dirname)
 *          .use(virtualFolder('the-jackson-fives'))
 *        .build();
 *
 *  The files will then be moved into a new folder called `the-jackson-fives`
 *  upon build.
 */
module.exports = function(virtualFolder) {
    return function(files, metalsmith, done) {
        if(typeof virtualFolder !== 'string' || !virtualFolder) {
            done();
            return;
        }

        Object.keys(files).forEach(function(filepath, index) {
            /* Check and make sure there's a trailing slash at the end of
             * the virtualFolder string. */
            const slash = (filepath.indexOf('/') > -1) ? '/' : '\\';
            let normalisedVirtualFolder = virtualFolder;

            if(virtualFolder.indexOf(slash) < (virtualFolder.length - 1)) {
                normalisedVirtualFolder += slash;
            }

            /* Apply the virtualFolder. */
            files[normalisedVirtualFolder + filepath] = files[filepath];
            delete files[filepath]
        });

        done();
    }
};