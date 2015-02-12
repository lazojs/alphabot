[![Build Status](https://travis-ci.org/lazojs/alphabot.svg?branch=master)](https://travis-ci.org/lazojs/alphabot)

# alphabot

> Executive Alpha, programmed to like things it has seen before.

Lazo node module templates for creating independent modules that can be combined to create an application.

## Usage

```javascript
var alphabot = require('alphabot');

// options
// - overwrite: if directory exists then overwrite it; default is false
// - template: the name of a node modules that is an alphabot template
alphabot('component', 'cmp/dest/name', { overwrite: true }, function (err, result) {
    if (err) {
        throw err;
    }

    // result is a message string
});
```