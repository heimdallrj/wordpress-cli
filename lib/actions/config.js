var gitClone = require('nodegit-clone');
var fs = require('fs');

var db = require('./db');
var env = require('../env');

module.exports = {
  init: function(dir, config) {
    console.log('initializing...');
    
    console.log('cloning wordpress latest from remote repository..');
    var args = {
      url: env.wpRemoteSrc.url,
    };
    if (dir) {
      args.localPath = dir;
    }
    gitClone(args).then(function() {
      console.log('clonned.');

      console.log('creating config.json..');
      var configFilePath = (dir) ? dir+'/'+env.config.file : env.config.file;
      fs.writeFile(configFilePath, JSON.stringify(config), function(err) {
        if (err) throw err;
        console.log('config.json created.');
        // [TODO] format config.json
      });

      console.log('updating wp-config.php..');
      var configPhpFilePathSample = (dir) ? dir+'/wp-config-sample.php' : 'wp-config-sample.php';
      var configPhpFilePath = (dir) > dir+'/wp-config.php' : 'wp-config.php';
      fs.readFile(configPhpFilePathSample, 'utf-8', (err, data) => {
        if (err) throw err;

        // find and replace
        var objMap = {
          "define('DB_NAME', 'database_name_here')": "define('DB_NAME', '"+config.mysql_db_name+"')",
          "define('DB_USER', 'username_here')": "define('DB_USER', '"+config.mysql_db_user+"')",
          "define('DB_PASSWORD', 'password_here')": "define('DB_PASSWORD', '"+config.mysql_db_password+"')",
          "define('DB_HOST', 'localhost')": "define('DB_HOST', '"+config.mysql_db_host+"')",
          "$table_prefix  = 'wp_'": "$table_prefix  = '"+config.mysql_db_tbl_prefix+"'"
        }

        var regExp = /define\('DB_NAME', 'database_name_here'\)|define\('DB_USER', 'username_here'\)|define\('DB_PASSWORD', 'password_here'\)|define\('DB_HOST', 'localhost'\)|\$table_prefix  = 'wp_'/g;

        var result = data.replace(regExp, function(matched, i) {
          return objMap[matched];
        });

        fs.writeFile(configPhpFilePath, result, function(err) {
          if (err) throw err;
          console.log('wp-config.php created.');
        });
      });

    });

    // create the database
    db.create(config);
  },

  update(key, val) {
    console.log('%s = %s is updating...', key, val);
    var configFilePath = env.config.file;
    fs.readFile(configFilePath, 'utf8', (err, config) => {
      if (err) throw err;
      var configJSON = JSON.parse(config);
      configJSON.config[key] = val;

      fs.writeFile(configFilePath, JSON.stringify(configJSON), function(err) {
        if (err) throw err;
        console.log('config.json updated.');
        // [TODO] format config.json
      });

    });

    // [TODO]
    // Do necessory changes according new config changes
  }
};
