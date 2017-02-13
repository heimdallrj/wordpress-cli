module.exports = {
  uri: {
    wp: {
      latest: 'https://wordpress.org/latest.zip'
    }
  },
  template: {
    config: 'site.json',
    wpConfig: 'wp-config.php',
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
