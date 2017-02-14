module.exports = {
  properties: {
    siteName: {
      description: 'Enter the site name'
    },
    mysqlDbHost: {
      description: 'MYSQL Database Host',
      default: 'localhost'
    },
    mysqlDbPort: {
      description: 'MYSQL Database Port',
      default: 'localhost',
      default: '3306'
    },
    mysqlDbUser: {
      description: 'MYSQL Database User',
      default: 'root'
    },
    mysqlDbPwd: {
      description: 'MYSQL Database Password',
      default: 'root'
    },
    mysqlDbName: {
      description: 'MYSQL Database Name'
    },
    mysqlDbTblPrefix: {
      description: 'MYSQL Database Table Prefix',
      default: 'wp_'
    }
  }
};
