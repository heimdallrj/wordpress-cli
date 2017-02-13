var fs = require('fs');
var fsExtra = require('fs-extra');
var _ =  require('lodash');

var env = require('../env');

function getFileContent(tplFp, tplParams) {
  var tplContent = fs.readFileSync(tplFp);

  if (!tplParams) {
    return tplContent;
  }
  return _.template(tplContent)(tplParams);
}

module.exports = {
  getTemplatePath: function(fp) {
    return 'lib/templates/'+fp+'.tpl';
  },

  writeFile: function(targetFp, tplFp, tplParams) {
    var fileContent = getFileContent(tplFp, tplParams);
    fsExtra.outputFileSync(targetFp, fileContent);
  },

  mkdirSync: function(dir) {
    try {
      fs.statSync(dir);
    } catch(e) {
      fs.mkdirSync(dir);
    }
  }
};
