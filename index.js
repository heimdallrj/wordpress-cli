var program = require('commander');
var prompt = require('prompt');
var gitClone = require('nodegit-clone');
var fs = require('fs');
var mysql = require('mysql');

// temp env. data
var env = {
  wpRemoteSrc: {
    url: 'git@github.com:thinkholic/wp-init-latest.git'
  },
  config: {
    file: 'config.json'
  }
};

// prompt schema
var promptSchema = {
  properties: {
    site_name: {
      description: 'Enter the site name'
    },
    mysql_db_host: {
      description: 'MYSQL Database Host',
      default: 'localhost'
    },
    mysql_db_user: {
      description: 'MYSQL Database User',
      default: 'root'
    },
    mysql_db_password: {
      description: 'MYSQL Database Password',
      default: 'root'
    },
    mysql_db_name: {
      description: 'MYSQL Database Name'
    },
    mysql_db_tbl_prefix: {
      description: 'MYSQL Database Table Prefix',
      default: 'wp_'
    }
  }
};

// program: init
program
  .command('init <dir>')
  .description('wp init <dir>')
  .action(function(dir) {
    // [TODO] Here, need to handle when `dir` param not provided
    // then, it should have get the root folder
    if (dir) {
      // prompt for user inputs
      prompt.start();
      prompt.get(promptSchema, function (err, config) {
        if (err) throw err;
        console.log(config);

        // get latest WordPress installation
        // via cloning the remote repository
        console.log('cloning...')
        gitClone({
          url: env.wpRemoteSrc.url,
          localPath: dir
        }).then(function(repo) {
          console.log('cloned.');

          // create config.json
          var configFilePath = dir+'/'+env.config.file;
          var configJSON = {
            config: {
              ste_name: config.site_name,
              mysql_db_host: config.mysql_db_host,
              mysql_db_user: config.mysql_db_user,
              mysql_db_password: config.mysql_db_password,
              mysql_db_name: config.mysql_db_name,
              mysql_db_tbl_prefix: config.mysql_db_tbl_prefix
            }
          };
          fs.writeFile(configFilePath, JSON.stringify(configJSON), function(err) {
            if (err) throw err;
            console.log('config.json created.');
            // [TODO] format config.json
          });

          // Updating wp-config.php
          // [TODO]
          // ** hard-coded path.. MUST change
          var configPhpFilePathSample = 'dir/wp-config-sample.php';
          var configPhpFilePath = 'dir/wp-config.php';
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

        // create MySQL Database
        console.log('DB creating...');
        var dbConn = mysql.createConnection({
          host : config.mysql_db_host,
          user : config.mysql_db_user,
          password : config.mysql_db_password
        });
        dbConn.connect();
        dbConn.query('CREATE DATABASE '+config.mysql_db_name, function(err, res) {
          if (err) throw err;
          console.log('DB created... '+config.mysql_db_name);
        });
        dbConn.end();
      });
    }
  });

// program: config
program
  .command('config <key> [val]')
  .description('wp config <key> [val]')
  .option('-u, --update_mode')
  .action(function(key, val, options) {
    if (options.update_mode) {
      // get current config
      // [TODO] [TEMP] Here, we use temp `dir` name for development purpose
      // later it must be remove and corrected.
      var configFilePath = 'dir/'+env.config.file;
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
    } else {
      console.log('\r\n  error: missing required flag `--update_mode`\r\n');
    }
  });

// program: refersh
program
  .command('refresh')
  .description('wp refresh')
  .action(function() {
    console.log('[wp config refresh]');
    console.log('UPDATE config.php according to config.json');
    console.log('DROP existing Database');
    console.log('CREATE new MySQL Database');
    console.log('INSTALL fresh copy of WordPress env.');
  });

// program: plugin
program
  .command('plugin <opt> <param>')
  .description('wp plugin <opt> <param>')
  .action(function(opt, param) {
    switch (opt) {
      case 'add':
        console.log('INSTALL `%s` plugin', param);
        break;
      case 'remove':
        console.log('REMOVE `%s` plugin', param);
        break;
      default:
        console.log('Invalid command.')
        break;
    }
  });

// program: template
program
  .command('template <opt> <param1> [param2] [param3]')
  .description('wp template <opt> <param1> [param2] [param3]')
  .action(function(opt, param1, param2, param3) {
    switch (opt) {
      case 'init':
        console.log('INITIALIZE empty wordpress theme name as `%s`', param1);
        console.log('CREATE theme folder and style.css in there');
        break;
      case 'add':
        console.log('CREATE a `%s` template in template directory according to the other two parameters (`%s`, `%s`)', param1, param2, param3);
        break;
      case 'remove':
        console.log('DELETE the `%s` template from template directory');
        break;
      default:
        console.log('Invalid command.')
        break;
    }
  });

// program: <anything else>
program
  .command('*')
  .action(function(env){
    console.log('Invalid input!: "%s"', env);
  });

program.parse(process.argv);

