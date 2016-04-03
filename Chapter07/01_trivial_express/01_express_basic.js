
var express = require('express');
var app = express();

app.get('/albums/:nome_album.json', function(req, res){
  console.log("ollè");
  res.end('hello world &'+req.params.nome_album);
});


app.listen(8080);
