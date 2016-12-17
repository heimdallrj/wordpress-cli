var program = require('commander');
var prompt = require('prompt');
var gitClone = require('nodegit-clone');
var fs = require('fs');
var mysql = require('mysql');

var env = {
  wpRemoteSrc: {
    url: 'git@github.com:CodeOcee/Yii-Project.git'
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
      description: 'MYSQL Database Host'
    },
    mysql_db_user: {
      description: 'MYSQL Database User'
    },
    mysql_db_password: {
      description: 'MYSQL Database Password'
    },
    mysql_db_name: {
      description: 'MYSQL Database Name'
    },
    mysql_db_tbl_prefix: {
      description: 'MYSQL Database Table Prefix'
    }
  }
};

// program: init
program
  .command('init <dir>')
  .description('wp init <dir>')
  .action(function(dir) {
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

          // [TODO] Update config.php
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

program
  .command('refresh')
  .description('')
  .action(function() {
    console.log('[wp config refresh]');
    console.log('UPDATE config.php according to config.json');
    console.log('DROP existing Database');
    console.log('CREATE new MySQL Database');
    console.log('INSTALL fresh copy of WordPress env.');
  });

program
  .command('add <opt> <param1> [param2] [param3]')
  .description('')
  .action(function(opt, param1, param2, param3) {
    console.log('[wp add %s %s %s %s]', opt, param1, param2, param3);
    switch (opt) {
      case 'plugin':
        console.log('INSTALL `%s` plugin', param1);
        break;
      case 'template':
        console.log('CREATE a `%s` template in template directory according to the other two parameters (`%s`, `%s`)', param1, param2, param3);
        break;
      default:
        console.log('Invalid command.')
        break;
    }
  });

program
  .command('remove <opt> <param>')
  .description('')
  .action(function(opt, param) {
    console.log('[wp remove %s %s]', opt, param);
    switch (opt) {
      case 'plugin':
        console.log('DELETE `%s` plugin', param);
        break;
      case 'template':
        console.log('DELETE the `%s` template from template directory');
        break;
      default:
        console.log('Invalid command.')
        break;
    }
  });

program
  .command('*')
  .action(function(env){
    console.log('Invalid input!: "%s"', env);
  });

program.parse(process.argv);
