var gitClone = require('nodegit-clone');
var fs = require('fs');
var _ =  require('lodash');

var Utils = require('./utils');
var Db = require('./db');
var env = require('../env');

module.exports = {
  init: function(dir, config) {
    console.log('initializing...');
    console.log('cloning wordpress latest from remote repository..');

    var args = {
      url: env.uri.wpRemoteSrc,
    };
    if (dir) {
      args.localPath = dir;
    }

    // [TODO]
    // need to implements a rollback function,
    // if anything goes wrong in the process

    gitClone(args).then(function() {
      console.log('clonned.');

      // create config.json
      console.log('creating config.json..');
      var configFilePath = Utils.getTargetFilePath(dir, env.template.config);
      var tplPath = Utils.getTemplatePath(env.template.config);

      Utils.writeFile(configFilePath, tplPath, config);

      // update wp-config.php 
      console.log('creating wp-config.php..');
      var configFilePath = Utils.getTargetFilePath(dir, env.template.wpConfig);
      var tplPath = Utils.getTemplatePath(env.template.wpConfig);

      Utils.writeFile(configFilePath, tplPath, config);
    });

    // create the database
    Db.create(config);
  },

  update(key, val) {
    // [TODO] [NOTE]
    // Here, for now, we allow to update database configs only.
    // later, it'll need to implement update all the values accordingly
    var validConfigs = env.allowUpdate.config;
    if (validConfigs.indexOf(key) === -1) {
      console.log('\r\n  error: invalid key config `%s`\r\n', key);
      return;
    }

    console.log('%s = %s is updating...', key, val);

    // file paths to be updated
    var configFilePath = Utils.getTargetFilePath(null, env.template.config);
    var wpConfigFilePath = Utils.getTargetFilePath(null, env.template.wpConfig);

    // update config changes
    var config = JSON.parse(fs.readFileSync(configFilePath, {encoding: 'utf-8'}));
    var newConfig = _.pick(config, ['siteName']);
    _.merge(newConfig, config.db);

    newConfig[key] = val;

    // update config.json
    console.log('updating config.json..');
    var tplPath = Utils.getTemplatePath(env.template.config);
    Utils.writeFile(configFilePath, tplPath, newConfig);

    // update wp-config.php
    console.log('updating wp-config.php..');
    var tplPath = Utils.getTemplatePath(env.template.wpConfig);
    Utils.writeFile(wpConfigFilePath, tplPath, newConfig);

    // [TODO]
    // Do necessory changes according new config changes
    // Drop previous DB if any
    // change table prefixes
  }
};
