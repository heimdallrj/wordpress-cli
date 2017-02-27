const fs = require('fs');
const fsExtra = require('fs-extra');
const _ = require('lodash');
const request = require('request');
const unzip = require('unzip');
const mv = require('mv');
const shelljs = require('shelljs/shell');

require('string-prototype');

const env = require('../env');

function getFileContent(tplFp, tplParams) {
  const tplContent = Utils.readFileSync(tplFp);

  if (!tplParams) {
    return tplContent;
  }
  return _.template(tplContent)(tplParams);
}

var Utils = {
  getTemplatePath(fp) {
    return `${__dirname}/../templates/${fp}.tpl`;
  },

  getResourcePath(fp) {
    return `${__dirname}/../resources/${fp}`;
  },

  writeFileSync(targetFp, tplFp, tplParams) {
    const fileContent = getFileContent(tplFp, tplParams);
    fsExtra.outputFileSync(targetFp, fileContent);
  },

  readFileSync(fp, charset = null) {
    const content = fs.readFileSync(fp, charset);
    return content;
  },

  copyFileSync(srcFp, targetFp) {
    shelljs.cp('-R', srcFp, targetFp);
  },

  isFileExists(fp) {
    try {
      fs.lstatSync(fp);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      }
      throw err;
    }

    return true;
  },

  mkdirSync(dir) {
    try {
      fs.statSync(dir);
    } catch (err) {
      fs.mkdirSync(dir);
    }
  },

  moveDir(srcDir, targetDir, cb) {
    mv(srcDir, targetDir, { mkdirp: true }, (err) => {
      if (err) {
        cb(err, null);
        return;
      }
      cb(null, true);
    });
  },

  downloadFile(fileUrl, targetFp, cb) {
    request(
      {
        url: fileUrl,
        encoding: null
      },
      (err, resp, body) => {
        if (err) {
          cb(err, null);
          return;
        }

        if (resp && resp.statusCode == 200) {
          try {
            fs.writeFileSync(targetFp, body);
            cb(null, { fp: targetFp });
          } catch (err) {
            cb(err, null);
          }
        } else {
          cb({
            name: 'Error',
            message: 'Invalid URL'
          }, null);
        }
      }
    );
  },

  unzipFile(srcFp, targetDir, cb) {
    const stream = fs.createReadStream(srcFp)
      .pipe(unzip.Extract({ path: targetDir }));

    stream.on('error', (err) => {
      cb(err, null);
    });

    stream.on('finish', () => {
      cb(null, true);
    });
  },

  unlinkSync(fp) {
    if (typeof fp === 'object') {
      fp.forEach((file) => {
        fs.unlinkSync(file);
      });
    } else {
      fs.unlinkSync(fp);
    }
  },

  forceUnlink(fp) {
    if (typeof fp !== 'object') {
      return;
    }
    shelljs.rm('-rf', fp);
  },

  getWorkingDir() {
    return shelljs.pwd();
  }
};

module.exports = Utils;
