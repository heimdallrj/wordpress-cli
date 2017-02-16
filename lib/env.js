module.exports = {
  uri: {
    wp: {
      latest: 'http://wordpress.org/latest.zip'
    }
  },
  template: {
    config: 'site.json',
    gitignore: '.gitignore',
    wpConfig: 'wp-config.php',
    styleFle: 'style.css'
  },
  server: {
    defaultPort: '8888'
  },
  allowUpdate: {
    config: [
      'mysqlDbHost',
      'mysqlDbPort',
      'mysqlDbUser',
      'mysqlDbPwd',
      'mysqlDbName',
      'mysqlDbTblPrefix'
    ]
  }
};
