var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Filter = require('broccoli-filter');
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
  
JsonModule.prototype.processFile =
    function processFile(srcDir, destDir, relativePath) {
  var self = this;
  var inputEncoding = this.inputEncoding;
  var outputEncoding = this.outputEncoding;
  if (inputEncoding === void 0) inputEncoding = 'utf8';
  if (outputEncoding === void 0) outputEncoding = 'utf8';
  var contents = fs.readFileSync(
      srcDir + '/' + relativePath, { encoding: inputEncoding });

  return Promise.resolve(this.processString(contents, relativePath, srcDir)).
      then(function asyncOutputFilteredFile(outputString) {
        var outputPath = self.getDestFilePath(relativePath);
        if (outputPath == null) {
          throw new Error('canProcessFile("' + relativePath + '") is true, but getDestFilePath("' + relativePath + '") is null');
        }
        outputPath = destDir + '/' + outputPath;
        mkdirp.sync(path.dirname(outputPath));
        fs.writeFileSync(outputPath, outputString, {
          encoding: outputEncoding
        });
      });
};

JsonModule.prototype.processString = function (string, relativePath, srcDir) {
  return new Promise(function(res, rej) {
    var schema = JSON.parse(string);
    deref(schema, path.resolve(srcDir, path.dirname(relativePath)), (err, fullSchema) => {
      if(err) {
        rej(err);
      } else {
        console.log('That worked: ' + JSON.stringify(fullSchema));
        res('export default ' + JSON.stringify(fullSchema) + ';');
      }
    });
  });
}
