fill-js
=======

A node module to fill out pdf forms (utf8 compatible).

## Installation
    npm install fill-pdf

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

based on [utf8-fdf-generator](https://www.npmjs.org/package/utf8-fdf-generator)
