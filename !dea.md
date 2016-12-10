# A code generator for WordPress

CLI Developer tool for WordPress developers to work on wordpress custom development in an efficient way.

## App flow

### Configuration

Developer can create WordPress dev envirement by calling `wp init` in the directory has already created or just call `wp init <dir name>` by enterring the directory name that wanted to create.

Then, it'll ask;
* Site name
* Database Host
* Database User
* Database Password
* Database Name
* WordPress Table Prefix
* Primary Template name

for create configuration file named as `config.json` 

In the process of configuring, it'll create the database and install latest WordPress version along with empty theme canvas accoring to the given settings in `config.json`.

### API

#### Initialization

```
wp init
wp init "example.com"
```

#### Config

```
wp config update site_name "My WordPress Site"
wp config update db_host "localhost"
wp config update db_user "root"
wp config update db_pwd "localhost"
wp config update db_name "myDb"
wp config update db_tbl_prefix "wpnew_"
wp config update tmpl_name "my-theme"
```

After that;

```
wp refresh
```

#### Pluging

> [WordPress Plugins SVN Mirror](https://github.com/wp-plugins)

```
wp add plugin <plugin name>
wp remove plugin <plugin name>
```

#### Templating

> [Template Hierarchy](https://developer.wordpress.org/themes/basics/template-hierarchy/)

> [The WordPress Template Hierarchy](https://wphierarchy.com/)

```
wp add template page
wp add template single
wp add template search
.
wp add template custom home “Home Page”
wp add template archive
wp add template archive news
```

