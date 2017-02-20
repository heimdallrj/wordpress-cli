module.exports = {
  uri: {
    wp: {
      latest: 'http://wordpress.org/latest.zip',
      pluginSrc: {
        withVersion: 'https://downloads.wordpress.org/plugin/<pluginName>.<pluginVersion>.zip',
        latestStable: 'https://downloads.wordpress.org/plugin/<pluginName>.zip'
      }
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
  },
  deleteList: [
    '<siteDir>/wp-config-sample.php',
    '<siteDir>/readme.html',
    '<siteDir>/wp-content/plugins/akismet',
    '<siteDir>/wp-content/plugins/hello.php'
  ]
};
