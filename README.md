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

Create and initialize the wordpress development environment.
You can either create a working directory and run `wp init` command in there or you just can run `wp init example.com` or `wp init "My WordPress Site"` command for that.

**wp serve**

Once you created and initialized the development environment, you can start a server instance on `http://localhost:8888` with followings.

```
cd example.com
wp serve
```

## License

MIT
