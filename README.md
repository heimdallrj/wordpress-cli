# WordPress CLI

A command-line toolkit for work on custom [WordPress](http://wordpress.org/) developments in an efficient way.

> This project is still at early stage.
> I'd love to hear from anyone who wish to contribute. Feel free to submit issues, feature requests and any sugegstion you mind. PRs are welcome! :-)

Click [here](https://github.com/thinkholic/wordpress-cli/projects/1?fullscreen=true) to see the ROADMAP

## Installation

```
npm install -g wordpress-cli
```

## Usage Guide

**wp init [dir]**

This perform follwing tasks;
* Grab the WordPress latest release and download it.
* Create the database.
* Create and initialize the wordpress development environment.

You can either create a working directory first and run `wp init` in there or you just can run `wp init example.com` or `wp init "My WordPress Site"` for that.

**wp serve**

Once you created and initialized the development environment, you can start a server instance on `http://localhost:8888` with this.

```
cd example.com
wp serve
```

## License

MIT
