var shelljs = require('shelljs/shell');

var Utils = require('./utils');
var env = require('../env');
var logger = require('../logger');

module.exports = {
  add: function(pluginId) {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error('You are not in the working directory.');
      return;
    }

    var pluginInfo = pluginId.split('@');
    var pluginId = pluginInfo[0];
    var pluginVersion = (pluginInfo[1]) ? pluginInfo[1] : '1.0.0';

    var pluginUrl = env.uri.wp.pluginSrc.allReplace({
      '<pluginId>': pluginId,
      '<pluginVersion>': pluginVersion
    });

    // download the plugin
    Utils.downloadFile(pluginUrl, `./.tmp/plugin-${pluginId}.${pluginVersion}.zip`, function(err, done) {
      if (err) {
        logger.error(`Invalid plugin name or version!`);
        return;
      }

      // unzip
      Utils.unzipFile(`./.tmp/plugin-${pluginId}.${pluginVersion}.zip`, `./site/wp-content/plugins`, function(err, done) {
        if (err) {
          logger.error(`${err.name}: ${err.message}`);
          return;
        }

        logger.log(`Plugin added... ${pluginId}@${pluginVersion}`);
      });
    });
  },

  remove: function(pluginId) {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error('You are not in the working directory.');
      return;
    }

    // [TODO]
    // Check before delete and show appropriate messages if not exisits
    shelljs.rm('-rf', `./site/wp-content/plugins/${pluginId}`);
    logger.log(`Plugin removed... ${pluginId}`);
  }
};
