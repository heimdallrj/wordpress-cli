var fs = require('fs');
var fsExtra = require('fs-extra');
var _ =  require('lodash');

var env = require('../env');

function getFileContent(tplPath, tplParams) {
  var tplContent = fs.readFileSync(tplPath);

  if (!tplParams) {
    return tplContent;
  }
  return _.template(tplContent)(tplParams);
}

module.exports = {
  getTargetFilePath: function(dir, fp) {
    return (dir) ? dir+'/'+fp : fp;
  },

  getTemplatePath: function(fp) {
    return 'lib/templates/'+fp+'.tpl';
  },

  getPluginUrl: function(identifier) {
    return env.uri.wpPluginSvn+'/'+identifier+'.git';
  },

  getPluginLocalPath: function(dir, identifier) {
    return (dir) ? dir+'/wp-content/plugins/'+identifier : './wp-content/plugins/'+identifier;
  },

  getThemeDir: function(dir, identifier) {
    return (dir) ? dir+'/wp-content/themes/'+identifier : './wp-content/themes/'+identifier;
  },

  getStylePath: function(themeDir, fp) {
    return themeDir+'/'+fp;
  },

  writeFile: function(targetPath, tplPath, tplParams) {
    var fileContent = getFileContent(tplPath, tplParams);
    fsExtra.outputFileSync(targetPath, fileContent);
  },

  removeDir: function(targetPath) {
    fsExtra.removeSync(targetPath);
  }
};
