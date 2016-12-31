var gitClone = require('nodegit-clone');

var Utils = require('./utils');

module.exports = {
  add: function(identifier) {
    console.log('installing.. `%s` plugin', identifier);

    var pluginUrl = Utils.getPluginUrl(identifier);
    var pluginPath = Utils.getPluginLocalPath(identifier);

    gitClone({ url: pluginUrl, localPath: pluginPath})
    .then(function(repo) {
      console.log('installed.');
    }).catch(function(err) {
      console.log('> Inavlid plugin identifier.');
    });
  },
  
  remove: function(identifier) {
    console.log('removing.. `%s` plugin', identifier);

    var pluginPath = Utils.getPluginLocalPath(identifier);
    Utils.rmdirAsync(pluginPath);
    console.log('plugin removed.');
  }
};
