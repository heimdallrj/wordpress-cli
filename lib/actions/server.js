var shelljs = require('shelljs/shell');

var Utils = require('./utils');
var env = require('../env');
var logger = require('../logger');

module.exports = {
  start: function() {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error('You are not in the working directory.');
      return;
    }
    logger.log('Server starting on.. ' + env.server.defaultPort);

    // start the server
    shelljs.exec(`php -S localhost:${env.server.defaultPort} -t ./site`);
  }
};
