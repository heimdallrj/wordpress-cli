var program = require('commander');
var prompt = require('prompt');

var promptSchema = require('./promptSchema/config');
var actions = require('./actions');

var logger = console;

// program: init
program
  .command('init [dir]')
  .description('wp init <dir>')
  .action(function(dir) {
    // prompt for user inputs
    prompt.start();
    prompt.get(promptSchema, function (err, config) {
      if (err) throw err;
      actions.config.init(dir, config);
    });
  });

// program: [anything else]
program
  .command('*')
  .action(function(env) {
    logger.log('Invalid command input!: "%s"', env);
  });

program.parse(process.argv);
