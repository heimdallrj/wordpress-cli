var prompt = require('prompt');
var fs = require('fs');

var Utils = require('./utils');
var promptSchema = require('../promptSchema/theme');
var env = require('../env');

module.exports = {
  init: function(identifier) {
    // prompt for user inputs
    prompt.start();
    prompt.get(promptSchema, function (err, config) {
      if (err) throw err;
      console.log('initializing empty wordpress theme name as `%s`', identifier);

      var themeDir = Utils.getThemeDir(null, identifier);
      fs.mkdir(themeDir, function(err) {
        if (err) throw err;
        
        // create style.css     
        var stylePath = Utils.getStylePath(themeDir, env.template.wpStyle);
        var tplPath = Utils.getTemplatePath(env.template.wpStyle);

        Utils.writeFile(stylePath, tplPath, config);
        console.log('created theme folder and style.css in there');
      });
    });
  },

  add: function(param1, param2, param3) {
    console.log('create a `%s` template in template directory according to the other two parameters (`%s`, `%s`)', param1, param2, param3);
  },
  
  remove: function(identifier) {
    console.log('delete the `%s` template from template directory', identifier);
  }
};
