# broccoli-json-schema-module

Converts JSON schema files to ES6 modules. `.json` files will be transpiled into `.js` files with the resolved json schema contents as the default export.

A file named `config.json` with contents `{}` will be transformed into `config.js` with contents `export default {};`.
  
## Installation

```bash
npm install --save-dev ontohub/broccoli-json-schema-module
```

## Usage

```js
var json = require('broccoli-json-schema-module');
tree = json(tree);
```
