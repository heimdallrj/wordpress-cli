var fs = require('fs');
var _ =  require('lodash');

var request = require('request');
var unzip = require('unzip');

var Utils = require('./utils');
var env = require('../env');

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

    // download wordpress-latest
    var fileUrl = env.uri.wp.latest;
    var output = `${tmpDir}/wp.zip`;
    request({url: fileUrl, encoding: null}, function(err, resp, body) {
      if(err) throw err;
      fs.writeFile(output, body, function(err) {
        console.log("file downloaded!");

        // extract it to 
        var stream = fs.createReadStream(output)
          .pipe(unzip.Extract({ path: rootDir+'site' }));

        stream.on('finish', function () {
          console.log("unzip finished");

          // [TODO]
          // create wp-config.php file

        });
      });
    });

  }
};
