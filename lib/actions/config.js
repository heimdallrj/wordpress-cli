const _ = require('lodash');

const Utils = require('./utils');
const Db = require('./db');

const env = require('../env');
const messages = require('../env/messages');
const logger = require('../logger');
const pkg = require('../../package.json');

// [TODO]
// - Implements a commit/rollback function
//   in case something goes wrong in the process
// - Improve the error handling

module.exports = {
  init(dir, config) {
    // set `rootDir`
    let rootDir = './';
    if (dir) {
      Utils.mkdirSync(dir);
      rootDir = `./${dir}/`;
    }

    logger.log(messages.config.initializing);

    const tmpDir = `${rootDir}.tmp`;
    const siteDir = `${rootDir}site`;

    // create `.tmp` directory
    Utils.mkdirSync(tmpDir);

    // update `cliVersion`
    config.cliVersion = pkg.version;

    // create `site.json`
    Utils.writeFileSync(
      rootDir + env.template.config,
      Utils.getTemplatePath(env.template.config),
      config
    );

    // create the databse
    Db.create(config, (err, done) => {
      if (err) {
        logger.log(messages.config.createDbFail);
      } else {
        logger.log(messages.config.createDbSuccess);
      }
    });

    // download wordpress-latest
    Utils.downloadFile(env.uri.wp.latest, `${tmpDir}/wp.zip`, (err, resp) => {
      if (err) {
        logger.log(messages.config.fetchWPLatestFail);
        return;
      }

      // unzip
      Utils.unzipFile(resp.fp, tmpDir, (err, done) => {
        if (err) {
          logger.log(messages.config.fetchWPLatestFail);
          return;
        }

        // move to the `site` directory
        Utils.moveDir(`${tmpDir}/wordpress`, siteDir, (err, done) => {
          if (err) {
            logger.log(messages.config.fetchWPLatestFail);
            return;
          }

          logger.log(messages.config.fetchWPLatestSuccess);

          // clean wordpress codebase
          const deleteList = env.deleteList;
          for (let i = 0; i < deleteList.length; i++) {
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
          const docRoot = (dir) ? `${Utils.getWorkingDir()}/${dir}` : `${Utils.getWorkingDir()}/`;
          const params = {
            '<siteName>': config.siteName,
            '<docRoot>': docRoot,
            '<cdSiteSir>': (dir) ? `cd ${dir}` : ''
          };
          logger.log(messages.config.success.allReplace(params));
        });
      });
    });
  },

  update(key, val) {
    if (!Utils.isFileExists('./site.json')) {
      logger.error(messages.config.notInWorkingDir);
      return;
    }

    // check isAllow to update the key
    const allowUpdate = env.allowUpdate.config;
    const isAllowed = (_.indexOf(allowUpdate, key) > -1);
    if (!isAllowed) {
      logger.error(`\r\n  error: invalid configuration key \`${key}\` \r\n`);
      return;
    }

    const config = JSON.parse(Utils.readFileSync('./site.json', 'utf-8'));
    config.db[key] = val;

    // [TODO]
    // Improve the logic here
    const newConfig = config.db;
    newConfig.siteName = config.siteName;
    newConfig.cliVersion = config.cliVersion;

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

    const params = {
      '<configJson>': JSON.stringify(newConfig, null, 2)
    };
    logger.log(messages.config.updated.allReplace(params));
  }
};
