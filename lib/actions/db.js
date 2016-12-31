var mysql = require('mysql');

module.exports = {
  create: function(config) {
    console.log('database creating..');
    var dbConn = mysql.createConnection({
      host : config.mysql_db_host,
      user : config.mysql_db_user,
      password : config.mysql_db_password
    });
    dbConn.connect();
    dbConn.query('CREATE DATABASE '+config.mysql_db_name, function(err, res) {
      if (err) throw err;
      console.log('database created... '+config.mysql_db_name);
    });
    dbConn.end();
  },

  drop: function(config) {
    console.log('database droping..');
    var dbConn = mysql.createConnection({
      host : config.mysql_db_host,
      user : config.mysql_db_user,
      password : config.mysql_db_password
    });
    dbConn.connect();
    dbConn.query('DROP DATABASE '+config.mysql_db_name, function(err, res) {
      if (err) throw err;
      console.log('database droped. '+config.mysql_db_name);
    });
    dbConn.end();
  }
};
