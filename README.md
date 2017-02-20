# WordPress CLI

A command-line toolkit for work on custom [WordPress](http://wordpress.org/) developments in an efficient way.

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

## Usage Guide

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
wp update <key> <val>
```

**wp serve**

Once you created and initialized the development environment, you can start a server instance on `http://localhost:8888` with this.

```
cd example.com
wp serve
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
