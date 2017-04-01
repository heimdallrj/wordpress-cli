const prompt = require('prompt');

const Utils = require('./utils');

const promptSchema = require('../promptSchema/theme');
const env = require('../env');
const messages = require('../env/messages');
const logger = require('../logger');

module.exports = {
  init() {
    if (!Utils.isFileExists('./site.json')) {
      logger.error(messages.config.notInWorkingDir);
      return;
    }

    // prompt for user inputs
    logger.log(messages.template.promptForUserInputs);

    prompt.start();
    prompt.get(promptSchema, (err, config) => {
      if (err) {
        logger.error(`${err.name}: ${err.message}`);
      }

      config.themeName = config.themeName
        .trim()
        .toLowerCase()
        .replace(/[ .!@#$%^*()\\/?<>\[\]{}&+=\|;:\"\']/g, '-')
        .replace(/(\-)+/g, '-');

      logger.log(messages.template.init.allReplace({
        '<themeName>': config.themeName
      }));

      // create theme directory
      Utils.mkdirSync(`./site/wp-content/themes/${config.themeName}`);

      // add `style.css`
      Utils.writeFileSync(
        `./site/wp-content/themes/${config.themeName}/style.css`,
        Utils.getTemplatePath(env.template.styleFile),
        config
      );

      // add `index.php`
      Utils.writeFileSync(
        `./site/wp-content/themes/${config.themeName}/index.php`,
        Utils.getTemplatePath(env.template.index),
        null
      );

      // copy `screenshot.png`
      Utils.copyFileSync(
        `${Utils.getResourcePath(env.resources.screenshot)}`,
        `./site/wp-content/themes/${config.themeName}/`
      );

      logger.log(messages.template.created.allReplace({
        '<themeDir>': `./site/wp-content/themes/${config.themeName}/`
      }));
    });
  }
};
