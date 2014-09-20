/*
 * route.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

'use strict';

var face = require('./../controllers/face');
var user = require('./../controllers/users');

module.exports = function(app) {
    app.route('/face')
        .post(face.upload);
    app.route('/face/:fileId')
        .get(face.get);

    app.route('/user/login')
        .post(user.login);
    app.route('/user/register')
        .post(user.register);
};
