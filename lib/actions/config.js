var _ =  require('lodash');

var Utils = require('./utils');
var Db = require('./db');

var env = require('../env');
var messages = require('../env/messages');
var logger = require('../logger');
var pkg = require('../../package.json');

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

    logger.log(messages.config.initializing);

    var tmpDir = rootDir + '.tmp';
    var siteDir = rootDir + 'site';

    // create `.tmp` directory
    Utils.mkdirSync(tmpDir);

    // update `cliVersion`
    config['cliVersion'] = pkg.version;

    // create `site.json`
    Utils.writeFileSync(
      rootDir + env.template.config,
      Utils.getTemplatePath(env.template.config),
      config
    );

    // create the databse
    Db.create(config, function(err, done) {
     if (err) {
      logger.log(messages.config.createDbFail);
     } else {
      logger.log(messages.config.createDbSuccess);
     }
    });

    // download wordpress-latest
    Utils.downloadFile(env.uri.wp.latest, `${tmpDir}/wp.zip`, function(err, resp) {
      if (err) {
        logger.log(messages.config.fetchWPLatestFail);
        return;
      }

      // unzip
      Utils.unzipFile(resp.fp, tmpDir, function(err, done) {
        if (err) {
          logger.log(messages.config.fetchWPLatestFail);
          return;
        }

        // move to the `site` directory
        Utils.moveDir(`${tmpDir}/wordpress`, siteDir, function(err, done) {
          if (err) {
            logger.log(messages.config.fetchWPLatestFail);
            return;
          }

          logger.log(messages.config.fetchWPLatestSuccess);

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

          logger.log(messages.config.ready);
          var docRoot = (dir) ? `${Utils.getWorkingDir()}/${dir}` : `${Utils.getWorkingDir()}/`; 
          var params = {
            '<siteName>': config.siteName,
            '<docRoot>': docRoot,
            '<cdSiteSir>': (dir) ? `cd ${dir}` : ''
          };
          logger.log(messages.config.success.allReplace(params));
        });
      });
    });
  },

  update: function(key, val) {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error(messages.config.notInWorkingDir);
      return;
    }

    // check isAllow to update the key
    var allowUpdate = env.allowUpdate.config;
    var isAllowed = (_.indexOf(allowUpdate, key) > -1) ? true : false;
    if (!isAllowed) {
      logger.error(`\r\n  error: invalid configuration key \`${key}\` \r\n`);
      return;
    }

    var config = JSON.parse(Utils.readFileSync('./site.json', 'utf-8'));
    config.db[key] = val;

    // [TODO]
    // Improve the logic here
    var newConfig = config.db;
    newConfig['siteName'] = config.siteName;
    newConfig['cliVersion'] = config.cliVersion;

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

    var params = {
      '<configJson>': JSON.stringify(newConfig, null, 2)
    };
    logger.log(messages.config.updated.allReplace(params));
  }
};
