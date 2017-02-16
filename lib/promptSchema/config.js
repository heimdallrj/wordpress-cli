module.exports = {
  properties: {
    siteName: {
      description: 'Enter the site name'
    },
    mysqlDbHost: {
      description: 'MYSQL Database Host',
      default: '127.0.0.1'
    },
    mysqlDbPort: {
      description: 'MYSQL Database Port',
      default: '3306'
    },
    mysqlDbUser: {
      description: 'MYSQL Database User',
      default: 'root'
    },
    mysqlDbPwd: {
      description: 'MYSQL Database Password',
      default: ''
    },
    mysqlDbName: {
      description: 'MYSQL Database Name',
      required: true
    },
    mysqlDbTblPrefix: {
      description: 'MYSQL Database Table Prefix',
      default: 'wp_'
    }
  }
};
