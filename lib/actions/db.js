var mysql = require('mysql');

module.exports = {
  create: function(config) {
    console.log('database creating..');

    var dbConn = mysql.createConnection({
      host : config.mysqlDbHost,
      user : config.mysqlDbUser,
      password : config.mysqlDbPwd,
      port: config.mysqlDbPort
    });
    dbConn.connect();
    dbConn.query('CREATE DATABASE '+config.mysqlDbName, function(err, res) {
      if (err) throw err;
      console.log('database created... '+config.mysqlDbName);
    });
    dbConn.end();
  },

  drop: function(config) {
    console.log('database droping..');
    
    var dbConn = mysql.createConnection({
      host : config.mysqlDbHost,
      user : config.mysqlDbUser,
      password : config.mysqlDbPwd,
      port: config.mysqlDbPort
    });
    dbConn.connect();
    dbConn.query('DROP DATABASE '+config.mysqlDbName, function(err, res) {
      if (err) throw err;
      console.log('database droped. '+config.mysqlDbName);
    });
    dbConn.end();
  }
};
