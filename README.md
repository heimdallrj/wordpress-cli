# WordPress CLI

A command-line toolkit for work on custom [WordPress](http://wordpress.org/) developments in an efficient way.

> **This is project is no longer maintaining here.**<br />
> **It has moved to [wp-artisan](https://github.com/kodeflex/wp-artisan)**

> This project is still at early (pre-alpha) stage.
> I'd love to hear from anyone who wish to contribute. Feel free to submit issues, feature requests and any suggestions you mind. PRs are welcome! :-)

Click [here](https://github.com/thinkholic/wordpress-cli/projects/1?fullscreen=true) to see the **ROADMAP**

## Prerequisites

You must require to install and configure followings on your development workstation first;
* Nodejs
* PHP 5.4 or higher
* MySQL

## Installation

```
npm install -g wordpress-cli
```

## Usage

**wp init [dir]**

This perform following tasks;
* Prompt for configuration data
* Fetch and download the WordPress latest release
* Creating the database
* Setup and initializing the wordpress development environment

You can either create a working directory first and run `wp init` in there or you just can run `wp init example.com` or `wp init "My WordPress Site"` for that.

**wp config**

Update configuration information here. It'll affect on `site.json` and `wp-config.php`.

```
wp config update <key> <val>
```

Only following keys that allowed to update through this command;
```
allowUpdate: {
  config: [
    'mysqlDbHost',
    'mysqlDbPort',
    'mysqlDbUser',
    'mysqlDbPwd',
    'mysqlDbName'
  ]
},
```

**wp serve**

Once you created and initialized the development environment, you can start a server instance on `http://localhost:8888` with `wp serve` (Or `wp s`).

```
cd example.com
wp serve
```

You can change the port with the `--port` (Or `-p`) flag like this.

```
wp serve -p 3000
```

**wp plugin**

You can add or remove plugins with this.
```
wp plugin add <plunginName> //or
wp plugin add <plunginName>@<versionNumber>
```

**wp template**

Create empty theme canvas on the theme directory. Once you run this command, it'll prompt for user inputs related to creating a theme.

```
wp template init
```

## License

MIT
