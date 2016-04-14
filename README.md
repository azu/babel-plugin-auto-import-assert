# babel-plugin-auto-import-assert

Automatically adds `var assert = require('assert');` to your code, if not *import*ed/*require*d `assert` module.

## Installation

    npm install babel-plugin-auto-import-assert

## Usage


### via [Babel CLI](http://babeljs.io/docs/usage/cli/)

```
$ babel --plugins babel-plugin-auto-import-assert /path/to/src/target.js > /path/to/build/target.js
```

or shortly,

```
$ babel --plugins auto-import-assert /path/to/src/target.js > /path/to/build/target.js
```


### via [Babel API](http://babeljs.io/docs/usage/api/)

```javascript
var babel = require('babel-core');
var jsCode = fs.readFileSync('/path/to/src/target.js');
var transformed = babel.transform(jsCode, {
    presets: [...],
    plugins: ['babel-plugin-auto-import-assert']
});
console.log(transformed.code);
```


### via [.babelrc](http://babeljs.io/docs/usage/babelrc/)

```javascript
{
  "presets": [
    ...
  ],
  "env": {
    "development": {
      "plugins": [
        "babel-plugin-auto-import-assert"
      ],
    }
  }
}
```

```
$ babel /path/to/src/target.js > /path/to/build/target.js
```


EXAMPLE
---------------------------------------

For given `math.js` below,

```javascript
'use strict';

function add (a, b) {
    assert(!isNaN(a));
    assert.equal(typeof b, 'number');
    assert.ok(!isNaN(b));
    return a + b;
}
```

Run `babel` with `--plugins auto-import-assert` to transform code.

```
$ babel --plugins auto-import-assert /path/to/demo/math.js > /path/to/build/math.js
```

Add `import assert from 'assert';` to your code.

```javascript
'use strict';

var assert = require('assert');

function add(a, b) {
    assert(!isNaN(a));
    assert.equal(typeof b, 'number');
    assert.ok(!isNaN(b));
    return a + b;
}
```


## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT