var program = require('commander');

// program: <any>
program
  .command('*')
  .action(function(env) {
    // greeting!
    console.log('wordpress-cli ...you will be a witness of something awesome in here :).');
  });

program.parse(process.argv);
