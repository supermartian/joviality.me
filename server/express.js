/*
 * express.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

var flash = require('connect-flash'),
    busboy = require('connect-busboy'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    route = require('./route/route.js');
    path = require('path'),
    express = require('express');

module.exports = function () {
    var app = express();

    app.use(cookieParser());

    app.use(flash());

    // Busboy
    app.use(busboy());

    route(app);
    return app;
};
