/**
 * This component works similarly to HTML <img> but runs the image through
 * [imgix](http://www.imgix.com/) to dynamically optimize for the requesting device.
 */
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var support = require('./support');

var Imgix = React.createClass({

  propTypes: {
    src: React.PropTypes.string.isRequired, // resolved against imgAssetPrefix if relative
    alt: React.PropTypes.string.isRequired, // for accessibility
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    imgParams: React.PropTypes.object, // REF http://www.imgix.com/docs/reference
    className: React.PropTypes.string,
  },

  contextTypes: {
    imgAssetPrefix: React.PropTypes.string,
  },

  mixins: [PureRenderMixin],

  getOptimizedSrcs: function() {
    // Handle pathological case of missing src. This will show up as missing
    // in the browser, with the alt tag. We do this instead of passing the
    // unoptimized URL so that the developer can see the failure in the
    // render.
    if (!this.props.src) return {};

    var isAbsoluteAlready = this.props.src.slice(0, 4) === 'http' || this.props.src.slice(0, 2) === '//';

    var absoluteSrc = isAbsoluteAlready ?
      this.props.src :
      this.context.imgAssetPrefix + this.props.src;

    var options = Object.assign({width: this.props.width, height: this.props.height}, this.props.imgParams);

    // Craft image URLs for each device-pixel-ratio, ignoring the passed in value.
    return {
      dpr1: support.processImage(absoluteSrc, Object.assign(options, {dpr: 1})),
      // 2x is HiDPI like Macbook Pro, plus many phones
      dpr2: support.processImage(absoluteSrc, Object.assign(options, {dpr: 2})),
      // 3x is supported on iPhone 6 and Nexus 6
      dpr3: support.processImage(absoluteSrc, Object.assign(options, {dpr: 3})),
    };
  },

  render: function render() {
    var srcs = this.getOptimizedSrcs();

    var srcSet = srcs.dpr1 + ' 1x, ' + srcs.dpr2 + ' 2x, ' + srcs.dpr3 + ' 3x';

    return React.createElement('img', {
      src: srcs.dpr1,
      srcSet: srcSet,
      className: this.props.className,
      width: this.props.width,
      height: this.props.height,
      style: { maxWidth: this.props.width, maxHeight: this.props.height },
      alt: this.props.alt
    });
  }

});

/**
 * Used by caller to set an alt attribute to blank, and make explicit that the alt
 * attribute is not applicable for this <img> tag.
 *
 * From http://en.wikipedia.org/wiki/Alt_attribute :
 *
 * The W3C recommends that images that convey no information, but are purely
 * decorative, be specified in CSS rather than in the HTML markup.
 * However, it may sometimes be necessary to include a decorative image as an
 * HTML img tag. In this case, if the image truly does not add to the content,
 * then a blank alt attribute should be included in the form of alt="".
 * This makes the page navigable for users of screen readers or non-graphical
 * browsers. If (in breach of the standard) no alt attribute has been
 * supplied, then browsers that cannot display the image will still display
 * something there, e.g. the URL of the image, or a fixed text string.
 */
Imgix.DECORATIVE = '';

module.exports = Imgix;
