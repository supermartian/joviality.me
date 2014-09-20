/*
 * face.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

'use strict';

var grid = require('gridfs-stream'),
    mongoose = require('mongoose'),
    facepp = require('./facepp');

var gfs = new grid(mongoose.connection.db, mongoose.mongo);

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

exports.upload = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename){
        console.log(fieldname);
        var fstream = gfs.createWriteStream({
            filename: filename
        });
        file.pipe(fstream);
        fstream.on('close', function(file) {
            facepp.detect('http://104.131.60.223:3000/face/'+file._id, function(err, faceresp) {
                if (err) {
                    res.send('shit');
                    return;
                }

                res.setHeader('Content-Type', "application/json");
                faceresp.on('data', function(chunk) {
                    res.send(chunk);
                });
            });
        });
    });
};

exports.get = function(req, res) {
    var fileId = req.params.fileId;
    var readstream = gfs.createReadStream({
        _id: fileId
    });
    res.setHeader('Content-disposition', 'attachment; filename='+fileId);
    readstream.pipe(res);
};
