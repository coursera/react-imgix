var Uri = require('jsuri');

// @see https://www.imgix.com/docs/reference
var PARAM_EXPANSION = Object.freeze({
  // Adjustment
  brightness: 'bri',
  contrast: 'con',
  exposure: 'exp',
  gamma: 'gam',
  highlights: 'high',
  hue: 'hue',
  invert: 'invert',
  'saturation': 'sat',
  'shaddows': 'shad',
  'sharpness': 'sharp',
  'unsharp-mask': 'usm',
  'unsharp-radius': 'usmrad',
  'vibrance': 'vib',

  // Automatic
  'auto-features': 'auto',

  // Background
  'background-color': 'bg',

  // Blend
  'blend': 'blend',
  'blend-mode': 'bm',
  'blend-align': 'ba',
  'blend-alpha': 'balph',
  'blend-padding': 'bp',
  'blend-width': 'bw',
  'blend-height': 'bh',
  'blend-fit': 'bf',
  'blend-crop': 'bc',
  'blend-size': 'bs',
  'blend-x': 'bx',
  'blend-y': 'by',

  // Border & Padding
  'border': 'border',
  'padding': 'pad',

  // Face Detection
  'face-index': 'faceindex',
  'face-padding': 'facepad',
  'faces': 'faces',

  // Format
  'chroma-subsampling': 'chromasub',
  'color-quantization': 'colorquant',
  'download': 'dl',
  'DPI': 'dpi',
  'format': 'fm',
  'lossless-compression': 'lossless',
  'quality': 'q',

  // Mask
  'mask-image': 'mask',

  // Mask
  'noise-blur': 'nr',
  'noise-sharpen': 'nrs',

  // Palette n/a
  // PDF n/a
  // Pixel Density n/a

  // Rotation
  'flip-direction': 'flip',
  'orientation': 'or',
  'rotation-angle': 'rot',

  // Size
  'crop-mode': 'crop',
  'fit-mode': 'fit',
  'image-height': 'h',
  'image-width': 'w',

  // Stylize
  'blurring': 'blur',
  'halftone': 'htn',
  'monotone': 'mono',
  'pixelate': 'px',
  'sepia-tone': 'sepia',

  // Trim TODO
  // Watermark TODO

  // Extra
  'height': 'h',
  'width': 'w',
});

var DEFAULT_OPTIONS = Object.freeze({
  auto: 'format', // http://www.imgix.com/docs/reference/automatic#param-auto
  dpr: 1,
});

function constructUrl(src, params) {
  var optionKeys = Object.keys(params);
  var fullUrl = optionKeys.reduce(function(uri, key) {
    return uri.addQueryParam(key, params[key]);
  }, new Uri(src));

  return fullUrl.toString();
}

/**
 * Construct a URL for an image with an Imgix proxy, expanding image options
 * per the [API reference docs](https://www.imgix.com/docs/reference).
 * @param  {String} imgProxy    URL of a proxy that transparently authorizes requests
 * @param  {String} src         src of raw image
 * @param  {Object} longOptions map of image API options, in long or short form per expansion rules
 * @return {String}             URL of image src transformed by Imgix
 */
function processImage(imgProxy, src, longOptions) {
  if (!src) {
    return '';
  }

  var shortOptions = Object.assign({}, DEFAULT_OPTIONS);
  Object.keys(longOptions).forEach(function(longKey) {
    var value = longOptions[longKey];
    var shortKey = PARAM_EXPANSION[longKey];
    if (shortKey) {
      shortOptions[shortKey] = value;
    } else {
      // fall back for any values that aren't in expansion defined above
      shortOptions[longKey] = value
    }
  });

  return constructUrl(imgProxy + src, shortOptions);
}

module.exports = [
  processImage,
];
