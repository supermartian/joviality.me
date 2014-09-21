/*
 * server.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

var mongoose = require('mongoose'),
    express = require('express');

mongoose.connect('mongodb://localhost/projectGT');

var app = require('./server/express')();
app.use('/', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});
