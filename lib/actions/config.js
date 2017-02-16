var fs = require('fs');
var _ =  require('lodash');
var request = require('request');
var unzip = require('unzip');
var shelljs = require('shelljs/shell');

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
    Utils.writeFile(
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
          var filesToRemove = [
            `${siteDir}/wp-config-sample.php`,
            `${siteDir}/readme.html`,
            `${siteDir}/wp-content/plugins/akismet`,
            `${siteDir}/wp-content/plugins/hello.php`
          ];
          shelljs.rm('-rf', filesToRemove);

          // create `wp-config.php`
          Utils.writeFile(
            `${siteDir}/${env.template.wpConfig}`,
            Utils.getTemplatePath(env.template.wpConfig),
            config
          );

          // create `.gitignore`
          Utils.writeFile(
            `${rootDir}/${env.template.gitignore}`,
            Utils.getTemplatePath(env.template.gitignore)
          );

          logger.log('Ready for development...');
        });
      });
    });
  }
};
