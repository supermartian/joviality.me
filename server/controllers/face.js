/*
 * face.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

'use strict';

require('./../models/users');
require('./../models/face');
var mongoose = require('mongoose');
var Face = mongoose.model('Face');
var User = mongoose.model('User');
var grid = require('gridfs-stream'),
    mongoose = require('mongoose'),
    facepp = require('./facepp');

var gfs = new grid(mongoose.connection.db, mongoose.mongo);

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

exports.upload = function(req, res) {
    var user = req.session.user;
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

                var resjson = '';
                faceresp.on('data', function(chunk) {
                    resjson += chunk;
                });
                faceresp.on('end', function() {
                    var result = JSON.parse(resjson);
                    if (!result) {
                        res.status(500).jsonp({error: 'deeeep shit'});
                        return;
                    }

                    if (result.faces.length === 0) {
                        res.status(500).jsonp({error: 'No faces'});
                        return;
                    }

                    var newFace = new Face();
                    newFace.user = user._id;
                    newFace.fileId = file._id;
                    newFace.smileRate = 0;
                    for (var i = 0; i < result.face.length; i++) {
                        console.log(result.face[i]);
                        newFace.smileRate += parseFloat(result.face[i].attribute.smiling.value);
                    }

                    newFace.save(function(err) {
                        if (err) {
                            res.status(500).jsonp({error: 'deeeep shit'});
                            return;
                        }

                        User.findById(user._id, function(err, u) {
                            if (err || u === undefined) {
                                res.status(500).jsonp({error: 'deeeep shit'});
                                return;
                            }

                            if (u.faces === undefined) {
                                u.faces = [];
                            }

                            u.faces.push(newFace._id);
                            u.save(function(err) {
                                if (err) {
                                    res.status(500).jsonp({error: 'deeeep shit'});
                                    return;
                                }

                                res.status(200).jsonp(newFace);
                            });
                        });
                    });
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
