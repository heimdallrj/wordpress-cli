var shelljs = require('shelljs/shell');

var Utils = require('./utils');
var env = require('../env');
var logger = require('../logger');

module.exports = {
  add: function(pluginName) {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error('You are not in the working directory.');
      return;
    }

    var pluginInfo = pluginName.split('@');
    var pluginName = pluginInfo[0];
    var pluginVersion = (pluginInfo[1]) ? pluginInfo[1] : undefined;

    if (pluginVersion) {
      // version specific
      var pluginUrl = env.uri.wp.pluginSrc.withVersion.allReplace({
        '<pluginName>': pluginName,
        '<pluginVersion>': pluginVersion
      });
    } else {
      var pluginUrl = env.uri.wp.pluginSrc.latestStable.allReplace({
        '<pluginName>': pluginName
      });
    }

    // download the plugin
    var tmpPluginPath = (pluginVersion) ? `./.tmp/plugin-${pluginName}.${pluginVersion}.zip` : `./.tmp/plugin-${pluginName}.zip`;
    var pluginId = (pluginVersion) ? `${pluginName}@${pluginVersion}` : pluginName;

    Utils.downloadFile(pluginUrl, tmpPluginPath, function(err, done) {
      if (err) {
        logger.error(`Invalid plugin name or version!`);
        return;
      }

      // unzip
      Utils.unzipFile(tmpPluginPath, `./site/wp-content/plugins`, function(err, done) {
        if (err) {
          logger.error(`${err.name}: ${err.message}`);
          return;
        }

        logger.log(`Plugin added... ${pluginId}`);
      });
    });
  },

  remove: function(pluginName) {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error('You are not in the working directory.');
      return;
    }

    // [TODO]
    // Check before delete and show appropriate messages if not exisits
    shelljs.rm('-rf', `./site/wp-content/plugins/${pluginName}`);
    logger.log(`Plugin removed... ${pluginName}`);
  }
};
