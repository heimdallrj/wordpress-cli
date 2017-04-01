const shelljs = require('shelljs/shell');
const mysql = require('mysql');

const Utils = require('./utils');

const env = require('../env');
const logger = require('../logger');
const messages = require('../env/messages');

module.exports = {
  start(options) {
    if (!Utils.isFileExists('./site.json')) {
      logger.error('You are not in the working directory.');
      return;
    }

    const config = JSON.parse(Utils.readFileSync('./site.json', 'utf-8'));
    const portToSet = options.port || env.server.defaultPort;
    const query = "UPDATE wp_options SET option_value = '" +
    `http://localhost:${portToSet}` +
    "' WHERE option_name = 'home' OR option_name = 'siteurl';";

    const dbConn = mysql.createConnection({
      host: config.db.mysqlDbHost,
      user: config.db.mysqlDbUser,
      password: config.db.mysqlDbPwd,
      port: config.db.mysqlDbPort,
      database: config.db.mysqlDbName
    });
    dbConn.connect();

    // Update the `siteurl` and `home` values in the wp_options table according to the new port.
    dbConn.query(query, (err, res) => {
      if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
        logger.error('Failed to update the port in the database. Please check your database ' +
        'connection settings in "./site.json"');
      } else {
        const params = {
          '<dateStarted>': new Date(),
          '<IP:PORT>': `http://localhost:${portToSet}`,
          '<docRoot>': `${Utils.getWorkingDir()}/site/`
        };
        logger.log(messages.server.init.allReplace(params));

        // start the server
        shelljs.exec(`php -S localhost:${portToSet} -t ./site`);
      }
    });
    dbConn.end();
  }
};
