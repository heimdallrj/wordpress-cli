module.exports = {
  init: function(identifier) {
    console.log('initializing empty wordpress theme name as `%s`', identifier);
    console.log('create theme folder and style.css in there');
  },

  add: function(param1, param2, param3) {
    console.log('create a `%s` template in template directory according to the other two parameters (`%s`, `%s`)', param1, param2, param3);
  },
  
  remove: function(identifier) {
    console.log('delete the `%s` template from template directory', identifier);
  }
};
