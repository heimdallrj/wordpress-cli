var program = require('commander');
var prompt = require('prompt');

var promptSchema = require('./promptSchema/config');
var pkg = require('../package.json');
var actions = require('./actions');
var logger = require('./logger');

program
  .version(pkg.version);
  
// program: init
program
  .command('init [dir]')
  .description('wp init [dir]')
  .action(function(dir) {
    // prompt for user inputs
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
        logger.error('\r\n  error: missing option flag `update`\r\n');
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
        logger.error(`Invalid command input!: ${opt}`);
        break;
    }
});

// program: serve
program
  .command('serve')
  .description('wp serve')
  .action(function() {
    actions.server.start();
  });

// program: [anything else]
program
  .command('*')
  .action(function(env) {
    logger.error(`Invalid command input!: ${env}`);
  });

program.parse(process.argv);
