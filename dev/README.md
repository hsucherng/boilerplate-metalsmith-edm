# EDM-NAME

This project uses [Metalsmith](http://metalsmith.io), and has been setup with the following:

- [Express](https://github.com/chiefy/metalsmith-express) (which also comes with LiveReload)
- [Inline CSS](https://github.com/borisovg/metalsmith-inline-css)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [SCSS](http://sass-lang.com/)
- [Stylelint](https://stylelint.io/)

## Initial setup

1. Make sure you have [NodeJS](http://nodejs.org) and [Yarn](http://yarnpkg.com/) installed. Currently tested with NodeJS v10.14.0 and Yarn v1.12.3.
2. Clone this repository onto your machine.
3. Open up the command-line and `cd` into this repository folder.
4. Run `yarn`. This should install all the required dependencies.
5. Run `node setup` to run a basic initial setup.
6. You are now ready to start building. Run `node build`, then navigate to the full localhost path to view the EDM.

## Notes

### YAML

Each page can have its own unique metadata through the YAML frontmatter. The format is typically as follows:

```
---
title: Home
subtitle: Welcome to Home
---

<p>Put your page contents here.</p>
```

Using the above example, inserting `{{ title }}` into your `.njk` file will then be replaced with `Home`, while inserting `{{ subtitle }}` will be replaced with `Welcome to Home`.

## Additional configurations

Check the files in the `configs` folder for the configurations that affect the build and its output:

- `express.js`: This determines the `host` and `port` to serve your EDM on. By default it is set to `localhost:8080`.
- `misc.js`: Miscellaneous settings:
    - `setupComplete`: This boolean is used to determine whether we've run the `setup` command. Once the `setup` command is completed, this property will be updated accordingly.
    - `virtualFolderName`: This determines the final path that the EDM will be served on. Once the `setup` command is completed, this property will be updated accordingly.
- `watch.js`: This determines what files are watched, as well as how the files trigger rebuilds of other files whenever they are changed.

## Stylelint

This project has `.stylelintignore` and `.stylelintrc.json` setup for use with [SublimeLinter](https://github.com/SublimeLinter/SublimeLinter) and [SublimeLinter-stylelint](https://github.com/SublimeLinter/SublimeLinter-stylelint). You will need to install both of those using Package Control, as well as globally installing PostCSS and Stylelint using `npm`:

```
npm install -g postcss stylelint
```

## Debugging notes

For certain plugins, we can get the build to log information in the console by setting the `DEBUG` environment variable.

On Windows, use the `set` command to set a value for the `DEBUG` environment variable. Setting it to `*` would turn on debugging for all configured plugins:

    set DEBUG=*

To turn on debugging for only one plugin, set its name as the value:

    set DEBUG=metalsmith-in-place

To turn off debugging, set the value to nothing:

    set DEBUG=