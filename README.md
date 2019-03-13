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

```js
const fillPdf = require("fill-pdf");
const formData = { FieldName: 'Text to put into form field' };
const pdfTemplatePath = "templates.pdf";

app.get('/filled_form.pdf', (req, res) => {
  fillPdf.generatePdf(formData, pdfTemplatePath, function(err, output) {
    if ( !err ) {
      res.type("application/pdf");
      res.send(output);
    }
  });
});
```

## Passing Custom Arguments to pdftk

For more specific uses, you can also pass some extra arguments to `pdftk`. It is done by
specifying them as an array, given as a third argument of the `fillPdf` function.

For instance, if you want to make the output PDF not editable anymore, you can append the
`flatten` argument such as:

```js
const fillPdf = require('fill-pdf');

const extraArgs = ['flatten'];
fillPdf.generatePdf(formData, pdfTemplatePath, extraArgs, (err, output) => {
  // ...
});
```

Take a look on `man pdftk` to get a list of all available arguments.

## Acknowledgements

Based on [utf8-fdf-generator](https://www.npmjs.org/package/utf8-fdf-generator)
