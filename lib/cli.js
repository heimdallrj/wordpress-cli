var program = require('commander');
var prompt = require('prompt');

var promptSchema = require('./promptSchema/config');
var pkg = require('../package.json');
var actions = require('./actions');
var logger = require('./logger');
var messages = require('./env/messages');

program
  .version(pkg.version);

// program: init
program
  .command('init [dir]')
  .description('wp init [dir]')
  .action(function(dir) {
    // welcome
    var docRoot = (dir) ? `${actions.utils.getWorkingDir()}/${dir}` : `${actions.utils.getWorkingDir()}/`;
    var params = {
      '<cliVersion>': pkg.version,
      '<docRoot>': docRoot
    };
    logger.log(messages.config.init.allReplace(params));

    // set `rootDir`
    var rootDir = './';
    if (dir) {
      rootDir = `./${dir}/`;
    }

    // check for existing project
    if (actions.utils.isFileExists(`${rootDir}site.json`)) {
      logger.error(messages.config.alreadyExists);
      return;
    }

    // prompt for user inputs
    logger.log(messages.config.promptForUserInputs);

    prompt.start();
    prompt.get(promptSchema, function (err, config) {
      if (err) {
        logger.error(`${err.name}: ${err.message}`);
        return;
      }
      actions.config.init(dir, config);
    });
  });

// program: config
program
  .command('config <opt> <key> <val>')
  .description('wp config update <key> <val>')
  .action(function(opt, key, val) {
    switch (opt) {
      case 'update':
        actions.config.update(key, val);
        break;
      default:
        logger.error(`\r\n  error: invalid option flag \`${opt}\` \r\n`);
        break;
    }
});

// program: plugin
program
  .command('plugin <opt> <pluginName>')
  .description('wp plugin <opt> <pluginName>@<pluginVersion>')
  .action(function(opt, pluginName) {
    switch (opt) {
      case 'add':
        actions.plugin.add(pluginName);
        break;
      case 'remove':
        actions.plugin.remove(pluginName);
        break;
      default:
        logger.error(`\r\n  error: invalid option flag \`${opt}\` \r\n`);
        break;
    }
});

// program: template
program
  .command('template <opt>')
  .description('wp template <opt>')
  .action(function(opt) {
    switch (opt) {
      case 'init':
        actions.template.init();
        break;
      default:
       logger.error(`\r\n  error: invalid option flag \`${opt}\` \r\n`);
        break;
    }
});

// program: serve
program
  .command('serve')
  .alias('s')
  .option('-p, --port [value]', 'Port to listen on (instead of the default 8888).')
  .description('wp serve')
  .action(function(options) {
    actions.server.start(options);
  });

// program: [anything else]
program
  .command('*')
  .action(function(env) {
    logger.error(`\r\n  error: invalid command input \`${env}\` \r\n`);
  });

program.parse(process.argv);
