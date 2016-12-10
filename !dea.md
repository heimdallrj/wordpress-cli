# A code generator for WordPress

CLI Developer tool for WordPress developers to work on wordpress custom development in an efficient way.

## App flow

### Installation

First of all, users need to install `wp-init` NPM module in the global scope to their computer.

```
npm install -g wp-init
```

> `wp-init` is just a temparaly name for now untill find a proper name for this.

### Configuring

Users can create WordPress dev envirement by calling `wp init` in the directory that already has created or call `wp init <dir name>` by enterring the directory name which wanted to create.

Then, it'll ask;
* Site name
* Database Host
* Database User
* Database Password
* Database Name
* WordPress Table Prefix
* Primary Template name

for create the configuration file named as `config.json` 

In the process of configuring, it'll create the database and install latest WordPress version along with empty theme canvas accoring to the given settings in `config.json`.

### API

#### Initialization

```
wp init
wp init "example.com"
```

#### Config

```
wp config -u site_name "My WordPress Site"
wp config -u db_host "localhost"
wp config -u db_user "root"
wp config -u db_pwd "localhost"
wp config -u db_name "myDb"
wp config -u db_tbl_prefix "wpnew_"
wp config -u tmpl_name "my-theme"
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

