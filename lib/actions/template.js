var prompt = require('prompt');

var Utils = require('./utils');
var promptSchema = require('../promptSchema/theme');
var env = require('../env');
var logger = require('../logger');

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

module.exports = {
  init: function() {
    if (! Utils.isFileExists(`./site.json`)) {
      logger.error('You are not in the working directory.');
      return;
    }

    // prompt for user inputs
    prompt.start();
    prompt.get(promptSchema, function (err, config) {
      if (err) {
        logger.error(`${err.name}: ${err.message}`);
      }

      config.themeName = config.themeName
        .trim()
        .toLowerCase()
        .replace(/[ .!@#$%^*()\\/?<>\[\]{}&+=\|;:\"\']/g, '-')
        .replace(/(\-)+/g, '-');

      logger.log(`Initializing theme directory... ${config.themeName}`);

      // create theme directory
      Utils.mkdirSync(`./site/wp-content/themes/${config.themeName}`);

      // add `style.css`
      Utils.writeFileSync(
        `./site/wp-content/themes/${config.themeName}/style.css`,
        Utils.getTemplatePath(env.template.styleFile),
        config
      );

      // copy `screenshot.png`
      Utils.copyFileSync(
        `${Utils.getResourcePath(env.resources.screenshot)}`,
        `./site/wp-content/themes/${config.themeName}/`
      );

      logger.log(`\`${config.themeName}\` theme created.`);
    });
  }
};
