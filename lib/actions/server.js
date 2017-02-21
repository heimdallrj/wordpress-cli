var shelljs = require('shelljs/shell');

var Utils = require('./utils');

var env = require('../env');
var logger = require('../logger');
var messages = require('../env/messages');

module.exports = {
  start: function() {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error('You are not in the working directory.');
      return;
    }

    var params = {
      '<dateStarted>': new Date(),
      '<IP:PORT>': `http://localhost:${env.server.defaultPort}`,
      '<docRoot>': `${Utils.getWorkingDir()}/site/`
    };
    logger.log(messages.server.init.allReplace(params));

    // start the server
    shelljs.exec(`php -S localhost:${env.server.defaultPort} -t ./site`);
  }
};
