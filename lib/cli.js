var program = require('commander');
var prompt = require('prompt');

var promptSchema = require('./promptSchema/config');
var actions = require('./actions');

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

// program: config
program
  .command('config <opt> <key> <val>')
  .description('wp config update <key> [val]')
  .action(function(opt, key, val) {
    switch (opt) {
      case 'update':
        actions.config.update(key, val);
        break;
      default:
        console.log('\r\n  error: missing option flag `update`\r\n');
        break;
    }
  });

// program: plugin
program
  .command('plugin <opt> <identifier>')
  .description('wp plugin <opt> <identifier>')
  .action(function(opt, identifier) {
    switch (opt) {
      case 'add':
        actions.plugin.add(identifier);
        break;
      case 'remove':
        actions.plugin.remove(identifier);
        break;
      default:
        console.log('Invalid command.');
        break;
    }
  });

// program: template
program
  .command('template <opt> <param1> [param2] [param3]')
  .description('wp template <opt> <param1> [param2] [param3]')
  .action(function(opt, param1, param2, param3) {
    switch (opt) {
      case 'init':
        actions.template.init(param1);
        break;
      case 'add':
        actions.template.add(param1, param2, param3);
        break;
      case 'remove':
        actions.template.remove(param1);
        break;
      default:
        console.log('Invalid command.');
        break;
    }
  });

// program: <anything else>
program
  .command('*')
  .action(function(env) {
    console.log('Invalid input!: "%s"', env);
  });

program.parse(process.argv);
