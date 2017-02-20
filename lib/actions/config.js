var _ =  require('lodash');

var Utils = require('./utils');
var Db = require('./db');
var env = require('../env');
var logger = require('../logger');

// [TODO]
// - Implements a commit/rollback function
//   in case something goes wrong in the process
// - Improve the error handling

module.exports = {
  init: function(dir, config) {
    // set `rootDir`
    var rootDir = './';
    if (dir) {
      Utils.mkdirSync(dir);
      rootDir = `./${dir}/`;
    }

    if (Utils.isFileExists(`${rootDir}site.json`)) {
      logger.warning('You have already intialized a WordPress project.');
      return;
    }

    logger.log('Initializing...');

    var tmpDir = rootDir + '.tmp';
    var siteDir = rootDir + 'site';

    // create `.tmp` directory
    Utils.mkdirSync(tmpDir);

    // create `site.json`
    Utils.writeFileSync(
      rootDir + env.template.config,
      Utils.getTemplatePath(env.template.config),
      config
    );

    // create the databse
    Db.create(config, function(err, done) {
     if (err) {
      logger.error(`${err.name}: ${err.message}`);
     } else {
      logger.log('Database has created...');
     }
    });

    // download wordpress-latest
    Utils.downloadFile(env.uri.wp.latest, `${tmpDir}/wp.zip`, function(err, resp) {
      if (err) {
        logger.error(`${err.name}: ${err.message}`);
        return;
      }
      
      // unzip
      Utils.unzipFile(resp.fp, tmpDir, function(err, done) {
        if (err) {
          logger.error(`${err.name}: ${err.message}`);
          return;
        }

        // move to the `site` directory
        Utils.moveDir(`${tmpDir}/wordpress`, siteDir, function(err, done) {
          if (err) {
            logger.error(`${err.name}: ${err.message}`);
            return;
          }

          // clean wordpress codebase
          var deleteList = env.deleteList;
          for(var i=0; i < deleteList.length; i++) {
            deleteList[i] = deleteList[i].replace('<siteDir>', siteDir);
          }
          Utils.forceUnlink(deleteList);

          // create `wp-config.php`
          Utils.writeFileSync(
            `${siteDir}/${env.template.wpConfig}`,
            Utils.getTemplatePath(env.template.wpConfig),
            config
          );

          // create `.gitignore`
          Utils.writeFileSync(
            `${rootDir}/${env.template.gitignore}`,
            Utils.getTemplatePath(env.template.gitignore)
          );

          logger.log('Ready for development...');
        });
      });
    });
  },

  update: function(key, val) {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error('You are not in the working directory.');
      return;
    }

    // check isAllow to update the key
    var allowUpdate = env.allowUpdate.config;
    var isAllowed = (_.indexOf(allowUpdate, key) > -1) ? true : false;
    if (!isAllowed) {
      logger.error(`Not a valid configuration: ${key} `);
      return;
    }

    var config = JSON.parse(Utils.readFileSync('./site.json', 'utf-8'));
    config.db[key] = val;

    // [TODO]
    // Improve the logic here
    var newConfig = config.db;
    newConfig['siteName'] = config.siteName;

    // update `site.json`
    Utils.writeFileSync(
      './site.json',
      Utils.getTemplatePath(env.template.config),
      newConfig
    );

    // update `wp-config.php`
    Utils.writeFileSync(
      './site/wp-config.php',
      Utils.getTemplatePath(env.template.wpConfig),
      newConfig
    );
  }
};
