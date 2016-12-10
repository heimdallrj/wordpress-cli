var program = require('commander');

program
  .command('init [dir]')
  .description('Initializing...')
  .action(function(dir) {
    console.log('[wp init %s]', dir);
    if (dir) {
      console.log('CREATE a directory named %s and chnage into that;', dir);
    }
    console.log('GET user inputs; site_name, db_host, db_user, db_pwd, db_name, db_tbl_prefix, tmpl_name');
    console.log('CREATE `config.json` file according to those user inputs');
    console.log('RUN generator script:');
    console.log('INSTALL WordPress latest version (CLONE from remote repository,');
    console.log('CREATE MySQL Database,');
    console.log('UPDATE config.php and other WordPress files accordingly.');
  });

program
  .command('config <key> [val]')
  .description('')
  .option('-u, --update_mode')
  .action(function(key, val, options) {
    console.log('[wp config %s %s %s]', options.update_mode, key, val);
    if (options.update_mode) {
      console.log('UPDATE config.json with %s = %s', key, val);
    } else {
      console.log('--update_mode flag need to be enable for running this command.')
    }
  });

program
  .command('refresh')
  .description('')
  .action(function() {
    console.log('[wp config refresh]');
    console.log('UPDATE config.php according to config.json');
    console.log('DROP existing Database');
    console.log('CREATE new MySQL Database');
    console.log('INSTALL fresh copy of WordPress env.');
  });

program
  .command('add <opt> <param1> [param2] [param3]')
  .description('')
  .action(function(opt, param1, param2, param3) {
    console.log('[wp add %s %s %s %s]', opt, param1, param2, param3);
    switch (opt) {
      case 'plugin':
        console.log('INSTALL `%s` plugin', param1);
        break;
      case 'template':
        console.log('CREATE a `%s` template in template directory according to the other two parameters (`%s`, `%s`)', param1, param2, param3);
        break;
      default:
        console.log('Invalid command.')
        break;
    }
  });

program
  .command('remove <opt> <param>')
  .description('')
  .action(function(opt, param) {
    console.log('[wp remove %s %s]', opt, param);
    switch (opt) {
      case 'plugin':
        console.log('DELETE `%s` plugin', param);
        break;
      case 'template':
        console.log('DELETE the `%s` template from template directory');
        break;
      default:
        console.log('Invalid command.')
        break;
    }
  });

program
  .command('*')
  .action(function(env){
    console.log('Invalid input!: "%s"', env);
  });

program.parse(process.argv);
