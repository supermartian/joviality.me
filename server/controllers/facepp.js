/*
 * facepp.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

'user strict';

var http = require('http'),
    FormData = require('form-data');

var apiKey = 'c9c3f648687109905ebdf17039e25896';
var apiSecret = 'J8fbMdfegmWlBqVFXuuoR3gXpPfXRSUz';
var apiUrl = 'http://apius.faceplusplus.com/';

var request = function(api, req, callback) {
    req.api_key = apiKey;
    req.api_secret = apiSecret;

    var form = new FormData();
    for (var field in req) {
        form.append(field, req[field]);
    }

    form.submit(apiUrl + api, function(err, res) {
        res.resume();
        callback(err, res);
    });
};

exports.detect = function(faceurl, callback) {
    var req = {};
    req.url = faceurl;
    request('detection/detect', req, callback);
};
