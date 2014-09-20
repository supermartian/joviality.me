/*
 * route.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

'use strict';

var face = require('./../controllers/face');

module.exports = function(app) {
    app.route('/face')
        .post(face.upload);
    app.route('/face/:fileId')
        .get(face.get);
};
