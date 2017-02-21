var chalk = require('chalk');
var logger = console;

// [TODO]
// This is just a scratch for now.
// Need to improve here

module.exports = {
  log: function(msg) {
    logger.log(msg);
  },

  error: function(msg) {
    logger.error(msg);
  },

  warning: function(msg) {
    logger.log(chalk.bold.yellow(msg));
  }
};
