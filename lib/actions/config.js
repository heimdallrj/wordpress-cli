var fs = require('fs');
var _ =  require('lodash');

var request = require('request');
var unzip = require('unzip');

var Utils = require('./utils');
var Db = require('./db');
var env = require('../env');

function cleanWp(dir) {
  // delete some files
  var filesToRemove = [
    `${dir}/wp-config-sample.php`,
    `${dir}/readme.html`,
    `${dir}/wp-content/plugins/hello.php`
  ];
  Utils.unlinkSync(filesToRemove);
}

// [TODO]
// Implements a commit/rollback function
// in case something goes wrong in the process

module.exports = {
  init: function(dir, config) {
    var rootDir = './';
    if (dir) {
      Utils.mkdirSync(dir);
      rootDir = `./${dir}/`;
    }

    // create .tmp directory
    var tmpDir = rootDir + '.tmp';
    Utils.mkdirSync(tmpDir);

    // create site.json
    var siteJsonFp = rootDir + env.template.config;
    var tplFp = Utils.getTemplatePath(env.template.config);
    Utils.writeFile(siteJsonFp, tplFp, config);

    // create databse
    Db.create(config, function(err, ready) {
      // [TODO]
      // Improve error handling
      // if(err) throw err; [!]

      console.log("Databse Created..");
    });

    // download wordpress-latest
    var fileUrl = env.dev.uri.wp.latest; // [!] Dev. Mode
    var targetFp = `${tmpDir}/wp.zip`;
    Utils.downloadFile(fileUrl, targetFp, function(err, resp) {
      // [TODO]
      // Improve error handling
      if(err) throw err;

      // unzip
      var srcFp = resp.fp;
      var targetDir = tmpDir;
      Utils.unzipFile(srcFp, targetDir, function(err, ready) {
        // [TODO]
        // Improve error handling
        if(err) throw err;

        // move to `site` directory
        var srcDir = `${tmpDir}/wordpress`;
        var targetDir = rootDir + 'site';
        Utils.moveDir(srcDir, targetDir, function(err, ready) {
          // [TODO]
          // Improve error handling
          if(err) throw err;

          cleanWp(targetDir);

          // create wp-config.php
          var wpConfigFp = `${targetDir}/${env.template.wpConfig}`;
          var tplFp = Utils.getTemplatePath(env.template.wpConfig);
          Utils.writeFile(wpConfigFp, tplFp, config);
        });
      });
    });
  }
};
