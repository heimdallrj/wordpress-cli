module.exports = {
  properties: {
    site_name: {
      description: 'Enter the site name'
    },
    mysql_db_host: {
      description: 'MYSQL Database Host',
      default: 'localhost'
    },
    mysql_db_user: {
      description: 'MYSQL Database User',
      default: 'root'
    },
    mysql_db_password: {
      description: 'MYSQL Database Password',
      default: 'root'
    },
    mysql_db_name: {
      description: 'MYSQL Database Name'
    },
    mysql_db_tbl_prefix: {
      description: 'MYSQL Database Table Prefix',
      default: 'wp_'
    }
  }
};
