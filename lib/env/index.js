module.exports = {
  uri: {
    wp: {
      latest: 'http://wordpress.org/latest.zip',
      pluginSrc: {
        withVersion: 'http://downloads.wordpress.org/plugin/<pluginName>.<pluginVersion>.zip',
        latestStable: 'http://downloads.wordpress.org/plugin/<pluginName>.zip'
      }
    }
  },
  template: {
    config: 'site.json',
    gitignore: '.gitignore',
    wpConfig: 'wp-config.php',
    styleFile: 'theme/style.css',
    index: 'theme/index.php'
  },
  resources: {
    screenshot: 'screenshot.png'
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
      'mysqlDbName'
    ]
  },
  deleteList: [
    '<siteDir>/wp-config-sample.php',
    '<siteDir>/readme.html',
    '<siteDir>/wp-content/plugins/akismet',
    '<siteDir>/wp-content/plugins/hello.php'
  ]
};
