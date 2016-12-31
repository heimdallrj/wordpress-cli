module.exports = {
  uri: {
    wpRemoteSrc: 'https://github.com/thinkholic/url-helper.git',
    wpPluginSvn: 'https://github.com/wp-plugins'
  },
  template: {
    config: 'config.json',
    wpConfig: 'wp-config.php',
    wpStyle: 'style.css'
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
