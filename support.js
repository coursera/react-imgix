var Uri = require('jsuri');

// @see https://www.imgix.com/docs/reference
var PARAM_EXPANSION = Object.freeze({
  format: 'fm',
  quality: 'q',
  blur: 'blur',
  width: 'w',
  height: 'h',
  dpr: 'dpr',
  mask: 'mask',
  brightness: 'bri',
  fit: 'fit',
  exposure: 'exp',
  auto: 'auto'
});

var DEFAULT_OPTIONS = Object.freeze({
  auto: 'format', // http://www.imgix.com/docs/reference/automatic#param-auto
  dpr: 1,
});

function constructUrl(src, params = {}) {
  var optionKeys = Object.keys(params);
  var fullUrl = optionKeys.reduce(function(uri, key) {
    return uri.addQueryParam(key, params[key]);
  }, new Uri(src));

  return fullUrl.toString();
}

function processImage(imgProxy, src, longOptions = {}) {
  if (!src) {
    return '';
  }

  var shortOptions = Object.assign({}, DEFAULT_OPTIONS);
  Object.keys(longOptions).forEach(function(longKey) {
    var shortKey = PARAM_EXPANSION[longKey];
    if (shortKey) {
      shortOptions[shortKey] = longOptions[longKey];
    }
  });

  return constructUrl(imgProxy + src, shortOptions);
}

module.exports = [
  constructUrl,
  processImage,
];
