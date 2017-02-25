var shelljs = require('shelljs/shell');
var mysql = require('mysql');

var Utils = require('./utils');

var env = require('../env');
var logger = require('../logger');
var messages = require('../env/messages');

module.exports = {
  start: function(options) {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error('You are not in the working directory.');
      return;
    }

    var config = JSON.parse(Utils.readFileSync('./site.json', 'utf-8'));
    const portToSet = options.port || env.server.defaultPort;
    const query = "UPDATE wp_options SET option_value = '" +
    `http://localhost:${portToSet}` +
    "' WHERE option_name = 'home' OR option_name = 'siteurl';"

    var dbConn = mysql.createConnection({
      host : config.db.mysqlDbHost,
      user : config.db.mysqlDbUser,
      password : config.db.mysqlDbPwd,
      port: config.db.mysqlDbPort,
      database: config.db.mysqlDbName
    });
    dbConn.connect();

    // Update the `siteurl` and `home` values in the wp_options table according to the new port.
    dbConn.query(query, function(err, res) {
      if (err) {
        logger.error('Failed to update the port in the database. Please check your database ' +
        'connection settings in "./site.json"');
      } else {
        var params = {
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
