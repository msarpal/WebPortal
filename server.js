/**
 * Common server file
 */
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var helmet = require('helmet');
var compression = require('compression');

var config = require('./config');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet()); //using helmet for protection against some well-known  vulnerabilities
app.use(compression()); // To compress the response of the body 

app.use('/api/property/tax',require('./src/api/property/PropertyTax'));

process.on('unhandledRejection', error => {
    console.log('Rejection error ==> ', error.message);
});

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');

var port = process.env.NODE_ENV === 'production' ? 80 : 4000;

var server = app.listen(port, function () {
    console.log('Common Server is running on :  ' + port);
});