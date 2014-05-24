# fill-js


A node module to fill out pdf forms (utf8 compatible).

It uses [pdftk](http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) to fill out pdf forms and [ghostscript](http://www.ghostscript.com/) to convert embedded fonts to outlines to increase cross-device robustness.

## Installation
    npm install fill-pdf
 
## Dependencies
You need to have the ```pdftk``` an ```gs``` binaries in your PATH.  


### Install on Mac OSX

* To install PDFtk use [the official installer](http://www.pdflabs.com/tools/pdftk-server/) or if you have [homebrew-cask](https://github.com/phinze/homebrew-cask) installed you can run ```brew cask install pdftk```
* To install Ghoscript via homebrew run :```brew install ghostscript```

### Install on Ubuntu
```sudo apt-get install pdftk ghostscript```

## Usage example (with express)

```javascript
var fillPdf = require("fill-pdf");
var formDate = { FieldName: 'Text to put into form field' };
var pdfTemplatePath = "templates.pdf";

app.get('/filled_form.pdf', function(req, res) {
  fillPdf.generatePdf(formDate,pdfTemplatePath, function(output) {
    res.type("application/pdf");
    res.send(output);
  });
});
```

## License
MIT

## Acknowledgements
based on [utf8-fdf-generator](https://www.npmjs.org/package/utf8-fdf-generator)
