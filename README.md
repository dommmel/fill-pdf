# fill-pdf

[![Build Status](https://travis-ci.org/dommmel/fill-pdf.svg?branch=master)](https://travis-ci.org/dommmel/fill-pdf)

A node module to fill out PDF forms (utf8 compatible).

It uses [pdftk](http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) to fill out PDF forms.

## Installation
    npm install fill-pdf
 
## Dependencies
You need to have the ```pdftk``` binary in your PATH.


### Install on Mac OSX

* To install PDFtk use [the official installer](http://www.pdflabs.com/tools/pdftk-server/) or if you have [homebrew-cask](https://github.com/phinze/homebrew-cask) installed you can run ```brew cask install pdftk```

### Install on Ubuntu
```sudo apt-get install pdftk```

## Usage example (with express)

```javascript
var fillPdf = require("fill-pdf");
var formDate = { FieldName: 'Text to put into form field' };
var pdfTemplatePath = "templates.pdf";

app.get('/filled_form.pdf', function(req, res) {
  fillPdf.generatePdf(formData, pdfTemplatePath, function(err, output) {
    if ( !err ) {
      res.type("application/pdf");
      res.send(output);
    }
  });
});
```

## Acknowledgements
Based on [utf8-fdf-generator](https://www.npmjs.org/package/utf8-fdf-generator)
