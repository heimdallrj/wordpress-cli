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
