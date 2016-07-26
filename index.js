'use strict';

const fs  = require('fs'),
    path  = require('path'),
    spawn = require('child_process').spawn,
    async = require('async'),
    temp  = require('temp'),
    Iconv = require('iconv').Iconv;

const iconv = new Iconv('UTF-8', 'UTF-16');

exports.generateFdf = function(data) {
  var header, body, footer, dataKeys;

  header = new Buffer('%FDF-1.2\n\u00e2\u00e3\u00cf\u00d3\n1 0 obj \n<<\n/FDF \n<<\n/Fields [\n');

  footer = new Buffer(']\n>>\n>>\nendobj \ntrailer\n\n<<\n/Root 1 0 R\n>>\n%%EOF\n');

  dataKeys = Object.keys(data);

  body = new Buffer([]);

  for(var i=0; i<dataKeys.length; i++) {
    var name = dataKeys[i].toString();
    var value = data[name].toString().replace('\r\n','\n');

    body = Buffer.concat([ body, new Buffer('<<\n/T (') ]);
    body = Buffer.concat([ body, iconv.convert(name.toString()) ]);
    body = Buffer.concat([ body, new Buffer(')\n/V (') ]);
    body = Buffer.concat([ body, iconv.convert(value.toString()) ]);
    body = Buffer.concat([ body, new Buffer(')\n>>\n') ]);
  }

  var fdf =  Buffer.concat([ header, body, footer ]);
  return fdf;
};

exports.generatePdf = function(data, templatePath, extendArgs, callback) {
  let tempNameResult = temp.path({suffix: '.pdf'}),
      pdfPath        = isAbsolute(templatePath) ? templatePath : path.join(__dirname, templatePath);

  let normalized = normalizeArgs(extendArgs, callback);

  extendArgs = normalized.args;
  callback   = normalized.callback;

  let processArgs = [pdfPath, 'fill_form', '-', 'output', tempNameResult].concat(extendArgs);

  let child = spawn('pdftk', processArgs);

  handlePdftkError(child, callback);
  handlePdftkExit(child, tempNameResult, callback);
  writeFdfToPdftk(child, data);
};

function normalizeArgs(extendArgs, callback) {
  // Check if extendArgs is our callback, adds backwards compat
  if (typeof extendArgs === 'function') {
   callback = extendArgs;
   extendArgs = [];
  }
  else if (!(extendArgs instanceof Array)) {
    extendArgs = [];
  }
  return { args: extendArgs, callback: callback };
}

function writeFdfToPdftk(child, data) {
  child.stdin.write(exports.generateFdf(data));
  child.stdin.end();
}

function handlePdftkError(child, callback) {
  child.on('error', function (err) {
    callback(err);
  });

  child.stderr.on('data', function (data) {
    console.error('stderr: ' + data);
  });
}

function handlePdftkExit(child, tempNameResult, callback) {
  child.on('exit', createHandlePdftkExit(tempNameResult, callback));
}

function createHandlePdftkExit(tempNameResult, callback) {
  return function(code) {
    if ( code ) {
      return callback(new Error('Non 0 exit code from pdftk spawn: ' + code));
    }

    async.waterfall([
      (cb) => {
        fs.readFile(tempNameResult, (err, filledPdf) => cb(err, filledPdf));
      },
      (filledPdf, cb) => {
        fs.unlink(tempNameResult, (err) => cb(err, filledPdf));
      }
    ],
    function(err, result) {
      callback(err, result);
    });
  };
}

function normalizeArgs(extendArgs, callback) {
  // Check if extendArgs is our callback, adds backwards compat
  if (typeof extendArgs === 'function') {
   callback = extendArgs;
   extendArgs = [];
  }
  else if (!(extendArgs instanceof Array)) {
    extendArgs = [];
  }
  return { args: extendArgs, callback: callback };
}

function isAbsolute(Path) {
    return (path.isAbsolute && path.isAbsolute(Path)) ||
           (path.normalize(Path + '/') === path.normalize(path.resolve(Path) + '/'));
}
