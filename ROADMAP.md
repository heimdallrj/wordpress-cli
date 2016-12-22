# WordPress CLI

Command-line Tool for WordPress developers to work on WordPress custom development in an efficient way.

## ROADMAP

### v1.x

#### Installation

```
npm install -g wp-cli
```

> `wp-cli` is just a temparaly name for now until find a proper name for this.

#### Initialization

Users can create WordPress dev envirement by calling `wp init` in the directory that already has created or call `wp init <dir name>` by enterring the directory name which wanted to create.

> Only `wp init <dir>` for v0.x

It'll prompt for;
```
var promptSchema = {
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
```

then, create the configuration file named as `config.json`

```
{
    ste_name: 'My Site',
    db: {
      mysql_db_host: 'localhost',
      mysql_db_user: 'root',
      mysql_db_password: 'root',
      mysql_db_name: 'myDb',
      mysql_db_tbl_prefix: 'wp_',
      :
    }
}
```

In the process of initialization, it'll create the database and install latest WordPress version along with empty theme canvas accoring to the given settings in `config.json`.

#### API

> For each of every command; it needs to update on `config.json`.

##### init
```
wp init
wp init "example.com"
```

##### config

```
wp config -u site_name "My WordPress Site"
wp config -u db_host "localhost"
wp config -u db_user "root"
wp config -u db_pwd "localhost"
wp config -u db_name "myDb"
wp config -u db_tbl_prefix "wpnew_"
```

##### plugin

> [WordPress Plugins SVN Mirror](https://github.com/wp-plugins)

```
wp plugin add <plugin name>
wp plugin remove <plugin name>
```

##### template

> [Template Hierarchy](https://developer.wordpress.org/themes/basics/template-hierarchy/)

> [The WordPress Template Hierarchy](https://wphierarchy.com/)

```
wp template init "MyTheme"
**
wp template add page
wp template add single
wp template add search
.
wp template add custom home “Home Page”
wp template add archive
wp template add archive news
```

### v2.x

##### config 

Update Site URL in config files and database.

```
wp config -u url <current_url> <new_url>
wp config -u -f url <current_url> <new_url>
```

##### refresh

```
wp refresh
```

##### plugin

Update plugin version & database without data lost `wp plugin update <plugin name> `

##### update 

Update WordPress version & database without data lost `wp update core`

##### deploy

WordPress deployment client.

* Once run `wp deploy init`;
    - It'll create .deploy folder
    - Prompt;
        + mysql_db_host, mysql_db_user, mysql_db_password, mysql_db_name, site_url
    - Backup database sql file in `.deploy/_db.sql`
    - Find and replace urls in the sql
    - Create updated `wp-config.php` in `.deploy/wp-config.php`
* Then, `wp deploy up`
    - Upload files & the database into the server.

##### backup / restore

Backup folder is `.backups` 

```
wp backup
wp restore <identifier>
``` 
