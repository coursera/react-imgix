# react-imgix

An isomorphic React component for image manipulation and automatic DPI
negotiation using Imgix.

This component is a drop-in replacement for `<img>` that runs the image
through [imgix](http://www.imgix.com/) to dynamically optimize for the
requesting device. It automatically constructs the `srcset` attribute so that
the developer need not be concerned with it.

The [srcset attribute can be used](http://caniuse.com/#feat=srcset) in all
modern browsers except IE. (It does work in Edge.) For more on srcset see
[High DPI Images for Variable Pixel
Densities](http://www.html5rocks.com/en/mobile/high-dpi/).

## Usage

This code currently assumes that you have a proxy server set up that handles the authentication to Imgix. Suppose your server is http://assets.example.com/imgProxy/ and you want your page to display an asset you have stored in S3 at https://s3.amazonaws.com/examplecom/logo.jpg. (Any PRs to support client-authenticated requests with [imgix-core-js](https://github.com/imgix/imgix-core-js) are welcomed.)

This React code:
```jsx
<Imgix src="https://s3.amazonaws.com/examplecom/logo.jpg" alt="Example Logo" height={40} />
```

resolves to this HTML in the browser:
```html
<img
  src="http://assets.example.com/imgProxy/https://s3.amazonaws.com/examplecom/logo.jpg?auto=format&amp;dpr=1&amp;w=&amp;h=40"
  srcset="
    http://assets.example.com/imgProxy/https://s3.amazonaws.com/examplecom/logo.jpg?auto=format&amp;dpr=2&amp;w=&amp;h=40 2x
    http://assets.example.com/imgProxy/https://s3.amazonaws.com/examplecom/logo.jpg?auto=format&amp;dpr=3&amp;w=&amp;h=40 3x
    "
  height="40"
  alt="Example Logo"
  data-reactid=".whatever.0.1.0.0.0.1.1.1.0.0.0">
```

## Alt tags

The `<Imgix>` component *requires* the `alt` property so that the developer must be explicit about accessibilty. However an [alt attribute](http://en.wikipedia.org/wiki/Alt_attribute) isn't always appropriate,
> The W3C recommends that images that convey no information, but are purely
> decorative, be specified in CSS rather than in the HTML markup.
> However, it may sometimes be necessary to include a decorative image as an
> HTML img tag. In this case, if the image truly does not add to the content,
> then a blank alt attribute should be included in the form of alt="".
> This makes the page navigable for users of screen readers or non-graphical
> browsers. If (in breach of the standard) no alt attribute has been
> supplied, then browsers that cannot display the image will still display
> something there, e.g. the URL of the image, or a fixed text string.

For these cases there is `Imgix.DECORATIVE`,
```jsx
<Imgix src="https://s3.amazonaws.com/examplecom/arrow.jpg" alt={Imgix.DECORATIVE} />
```
