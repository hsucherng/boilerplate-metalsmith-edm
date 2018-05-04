# Metalsmith EDM boilerplate

To set it up:

1. Make sure you have [NodeJS](http://nodejs.org) and [Yarn](http://yarnpkg.com/) installed. Currently tested with NodeJS v6.9.3 and Yarn v1.6.0.
2. Clone this repository onto your machine.
3. Make a copy of the `dev` folder and paste it at where you want your development files to be.
4. Open up the command-line and `cd` into the freshly copied `dev` folder.
5. Run `yarn`. This should install all the required dependencies.
6. Check and update the following files inside your `dev` folder:
    - `configs/misc.js` - change the value of `virtualFolder` from `edm` to the name of the EDM that you are building.
    - `README.md` - at the top of the file, change the `EDM Name` text to the name of the EDM that you are building.
    - `src/style.scss` - at the top of the file, change the `EDM Name` text to the name of the EDM that you are building.
    - `src/index.html` - change the `EDM Name` text to the name of the EDM that you are building.
7. You are now ready to start building. Run `node build --open`, then the EDM will be opened in your browser once it is ready.

For more detailed information, check the `README.md` document inside the `dev` folder.