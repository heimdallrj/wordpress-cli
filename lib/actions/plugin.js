const Utils = require('./utils');

const env = require('../env');
const messages = require('../env/messages');
const logger = require('../logger');

module.exports = {
  add(pluginName) {
    if (!Utils.isFileExists('./site.json')) {
      logger.error(messages.config.notInWorkingDir);
      return;
    }

    logger.log(messages.plugin.adding);

    const pluginInfo = pluginName.split('@');
    var pluginName = pluginInfo[0];
    const pluginVersion = (pluginInfo[1]) ? pluginInfo[1] : undefined;

    const pluginSrc = (pluginVersion) ? env.uri.wp.pluginSrc.withVersion :
    env.uri.wp.pluginSrc.latestStable;
    // generate pluginUrl
    const replaceList = {
      '<pluginName>': pluginName,
      '<pluginVersion>': pluginVersion
    };
    pluginUrl = pluginSrc.allReplace(replaceList);

    // download the plugin
    const tmpPluginPath = (pluginVersion) ? `./.tmp/plugin-${pluginName}.${pluginVersion}.zip` :
     `./.tmp/plugin-${pluginName}.zip`;
    const pluginId = (pluginVersion) ? `${pluginName}@${pluginVersion}` : pluginName;

    Utils.downloadFile(pluginUrl, tmpPluginPath, (err, done) => {
      if (err) {
        logger.error(messages.plugin.addedFail);
        return;
      }

      // unzip
      Utils.unzipFile(tmpPluginPath, './site/wp-content/plugins', (err, done) => {
        if (err) {
          logger.error(`${err.name}: ${err.message}`);
          return;
        }

        logger.error(messages.plugin.addedSuccess);
      });
    });
  },

  remove(pluginName) {
    if (!Utils.isFileExists('./site.json')) {
      logger.error(messages.config.notInWorkingDir);
      return;
    }

    logger.log(messages.plugin.removing);

    // [TODO]
    // Check before delete and show appropriate messages if not exisits
    Utils.forceUnlink([`./site/wp-content/plugins/${pluginName}`]);
    logger.log(messages.plugin.removedSuccess);
  }
};
