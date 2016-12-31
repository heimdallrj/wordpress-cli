var gitClone = require('nodegit-clone');

var util = require('./util');
var env = require('../env');

module.exports = {
  add: function(identifier) {
    console.log('installing.. `%s` plugin', identifier);
    var pluginUrl = env.pluginSvn+'/'+identifier+'.git';
    var pluginPath = './wp-content/plugins/'+identifier;

    gitClone({ url: pluginUrl, localPath: pluginPath})
    .then(function(repo) {
      console.log('installed.');
    }).catch(function(err) {
      console.log('> Inavlid plugin identifier.');
    });
  },
  
  remove: function(identifier) {
    console.log('removing.. `%s` plugin', identifier);
    var pluginPath = './wp-content/plugins/'+identifier;
    util.rmdirAsync(pluginPath, function(err) {
      if (err) throw err;
      console.log('plugin removed.');
    });
  }
};
