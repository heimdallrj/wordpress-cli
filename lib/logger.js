const chalk = require('chalk');

const logger = console;

// [TODO]
// This is just a scratch for now.
// Need to improve here

module.exports = {
  log(msg) {
    logger.log(msg);
  },

  error(msg) {
    logger.error(chalk.bold.red(msg));
  },

  warning(msg) {
    logger.log(chalk.bold.yellow(msg));
  }
};
