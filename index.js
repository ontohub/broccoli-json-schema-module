var Filter = require('broccoli-filter')
var deref = require('json-schema-deref');

module.exports = JsonModule
JsonModule.prototype = Object.create(Filter.prototype)
JsonModule.prototype.constructor = JsonModule
function JsonModule (inputTree, options) {
  if (!(this instanceof JsonModule)) return new JsonModule(inputTree, options)
  Filter.call(this, inputTree, options)
  options = options || {};
}

JsonModule.prototype.extensions = ['json']
JsonModule.prototype.targetExtension = 'js'
  
JsonModule.prototype.processString = function (string) {
  return new Promise(function(res, rej) {
    var schema = JSON.parse(string);
    deref(schema, 'app/schemas', (err, fullSchema) => {
      if(err) {
        rej(err);
      } else {
        res('export default ' + JSON.stringify(fullSchema) + ';');
      }
    });
  });
}
