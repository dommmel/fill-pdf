var fs    = require('fs')
  , Iconv = require('iconv').Iconv
  , iconv = new Iconv('UTF-8', 'UTF-16')
  , exec  = require('child_process').exec
  , spawn = require('child_process').spawn
  , temp  = require('temp');

exports.generateFdf = function(data) {
  var header, body, footer, dataKeys;

  // We should really come up with a new way of making FDF files, this is doing a lot of buffer instantiation..

  header = Buffer([]);
  header = Buffer.concat([ header, new Buffer("%FDF-1.2\n") ]);
  header = Buffer.concat([ header, new Buffer((String.fromCharCode(226)) + (String.fromCharCode(227)) + (String.fromCharCode(207)) + (String.fromCharCode(211)) + "\n") ]);
  header = Buffer.concat([ header, new Buffer("1 0 obj \n") ]);
  header = Buffer.concat([ header, new Buffer("<<\n") ]);
  header = Buffer.concat([ header, new Buffer("/FDF \n") ]);
  header = Buffer.concat([ header, new Buffer("<<\n") ]);
  header = Buffer.concat([ header, new Buffer("/Fields [\n") ]);

  footer = Buffer([]);
  footer = Buffer.concat([ footer, new Buffer("]\n") ]);
  footer = Buffer.concat([ footer, new Buffer(">>\n") ]);
  footer = Buffer.concat([ footer, new Buffer(">>\n") ]);
  footer = Buffer.concat([ footer, new Buffer("endobj \n") ]);
  footer = Buffer.concat([ footer, new Buffer("trailer\n") ]);
  footer = Buffer.concat([ footer, new Buffer("\n") ]);
  footer = Buffer.concat([ footer, new Buffer("<<\n") ]);
  footer = Buffer.concat([ footer, new Buffer("/Root 1 0 R\n") ]);
  footer = Buffer.concat([ footer, new Buffer(">>\n") ]);
  footer = Buffer.concat([ footer, new Buffer("%%EOF\n") ]);

  dataKeys = Object.keys(data);

  body = new Buffer([]);

  for(var i=0; i<dataKeys.length; i++) {
    var name = dataKeys[i];
    var value = data[name].toString().replace("\r\n","\r");

    body = Buffer.concat([ body, new Buffer("<<\n") ]);
    body = Buffer.concat([ body, new Buffer("/T (") ]);
    body = Buffer.concat([ body, iconv.convert(name.toString()) ]);
    body = Buffer.concat([ body, new Buffer(")\n") ]);
    body = Buffer.concat([ body, new Buffer("/V (") ]);
    body = Buffer.concat([ body, iconv.convert(value.toString()) ]);
    body = Buffer.concat([ body, new Buffer(")\n") ]);
    body = Buffer.concat([ body, new Buffer(">>\n") ]);
  }

  var fdf =  Buffer.concat([ header, body, footer ]);
  return fdf;
}

exports.generatePdf = function(data, templatePath, callback) {
  var tempName = temp.path({suffix: '.pdf'});
  var tempNameResult = temp.path({suffix: '.pdf'});

  child = spawn("pdftk", [__dirname+templatePath,"fill_form","-","output",tempName,"flatten"]);

  child.on('exit', function(code) {

    // If a exit code besides 0 was thrown then send an error
    if ( code ) {
      callback(new Error('Non 0 exit code from pdftk spawn: ' + code));
    }

    // Is GhostScript necessary for this module?
    exec("gs -dNOCACHE -sDEVICE=pdfwrite -sOutputFile="+tempNameResult +" -dbatch -dNOPAUSE -dQUIET  " + tempName +"  -c quit",
      function (error, stdout, stderr) {

        // Check if Error thrown from exec
        if (error) {
          console.error('exec error: ' + error + '\n' + stderr);
          callback(err);
        }

        if ( stderr ) {
          console.error('stderr: ' + stderr);
        }


        // Async read tempfile, we should think about making this a stream instead of a read into memory.
        fs.readFile(tempNameResult, function(err, filledPdf) {

          if ( err ) {
            callback(err);
          }

          // Delete files, doing nested callbacks for now, but lets look into maybe using async for this
          fs.unlink(tempName, function(err) {
            if ( err ) {
              return callback(err);
            }

            fs.unlink(tempNameResult, function(err) {
              if ( err ) {
                return callback(err);
              }

              // Everything Looks good, send back pdfFile.
              callback(null, filledPdf);

            });
          })
        });
     });
   });

    // Throw Error if code is given.. Code = 0 is good
    if ( code ) {
      throw new Error('Exit Code: ' + code);
    }

  // Write FDF file to pdftk spawned process
  child.stdin.write(exports.generateFdf(data));
  child.stdin.end();

  child.on('error', function (err) {
    callback(err);
  });

  child.stderr.on('data', function (data) {
    console.error('stderr: ' + data);
  });

}
