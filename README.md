extbuffer
============

Extends Buffer objects with additional convenience methods

[![Build Status](https://img.shields.io/travis/jseidelin/extbuffer.svg)](https://travis-ci.org/jseidelin/extbuffer)
[![npm version](https://img.shields.io/npm/v/extbuffer.svg)](https://www.npmjs.com/package/extbuffer)



## Usage

```javascript
var ExtBuffer = require("extbuffer");
var fs = require("fs");

var buffer = new ExtBuffer(fs.readFileSync("file.ext"));

// read a signed, 24-bit integer
buffer.reatInt24LE(0);
```