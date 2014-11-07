var express = require('express');
var formidable = require("formidable");
var fs=require('fs');
var app = express()

app.get('/upload', function (req, res) {

 console.log('upload');
 
  res.send('<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<div">upload:</div>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>')
})

app.post('/uploadHeadImg',function(request, response){

	 var form = new formidable.IncomingForm();

        form.uploadDir = __dirname + '/';

        form.on('file', function(field, file)  {
                fs.rename(file.path, form.uploadDir + "/" + file.name);
        })
       .on('error', function(err) {
            console.log("an error has occured with form upload");
            console.log(err);
            request.resume();
        })
      .on('aborted', function(err) {
            console.log("user aborted upload");
        })
        .on('end', function() {
            console.log('-> upload done');
        });

        form.parse(request, function(err, fields, files) {
															response.send(files);
															});

})

app.listen(3000)