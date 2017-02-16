var fs = require('fs');
var fsExtra = require('fs-extra');
var _ =  require('lodash');
var request = require('request');
var unzip = require('unzip');
var mv = require('mv');

var env = require('../env');

function getFileContent(tplFp, tplParams) {
  var tplContent = fs.readFileSync(tplFp);

  if (!tplParams) {
    return tplContent;
  }
  return _.template(tplContent)(tplParams);
}

module.exports = {
  getTemplatePath: function(fp) {
    return `${__dirname}/../templates/${fp}.tpl`;
  },

  writeFile: function(targetFp, tplFp, tplParams) {
    var fileContent = getFileContent(tplFp, tplParams);
    fsExtra.outputFileSync(targetFp, fileContent);
  },

  mkdirSync: function(dir) {
    try {
      fs.statSync(dir);
    } catch(err) {
      fs.mkdirSync(dir);
    }
  },

  downloadFile: function(fileUrl, targetFp, cb) {
    request(
      {
        url: fileUrl,
        encoding: null
      },
      function(err, resp, body) {
        if (err) {
          cb(err, null);
          return;
        }
        
        try {
          fs.writeFileSync(targetFp, body);
          cb(null, {fp: targetFp});
        } catch(err) {
          cb(err, null);
          return;
        }
      }
    );
  },

  unzipFile: function(srcFp, targetDir, cb) {
    var stream = fs.createReadStream(srcFp)
      .pipe(unzip.Extract({ path: targetDir }));

    stream.on('error', function (err) {
      cb(err, null);
      return;
    });

    stream.on('finish', function () {
      cb(null, true)
    });    
  },

  moveDir: function(srcDir, targetDir, cb) {
    mv(srcDir, targetDir, { mkdirp: true }, function(err) {
      if (err) {
        cb(err, null);
        return;
      }
      cb(null, true);
    });
  },

  unlinkSync: function(fp) {
    if (typeof fp === 'object') {
      fp.forEach(function(file) {
        fs.unlinkSync(file);
      });
    } else {
      fs.unlinkSync(fp);
    }
  },

  isFileExists: function(fp) {
    try {
      fs.lstatSync(fp);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        throw err;
      }
    }

    return true;    
  }
};
