const express = require('express')
const app = require('./app')
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname + '/sslcert/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/sslcert/server.cert', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(3500, () => { console.log('Server started on port 3500!!')});
