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

     var pluginSrc = (pluginVersion) ? env.uri.wp.pluginSrc.withVersion : env.uri.wp.pluginSrc.latestStable;
    // generate pluginUrl
    var replaceList = {
      '<pluginName>': pluginName,
      '<pluginVersion>': pluginVersion
    };
    pluginUrl = pluginSrc.allReplace(replaceList);

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
