/*
 * express.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

var flash = require('connect-flash'),
    busboy = require('connect-busboy'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    route = require('./route/route.js'),
    path = require('path'),
    express = require('express');

module.exports = function () {
    var app = express();

    app.use(cookieParser());
    app.use(expressValidator());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(flash());
    app.use(session({
        secret: 'connect.sid',
        store: new MongoStore({
            db : 'projectGT',
        })
    }));

    // Busboy
    app.use(busboy());

    route(app);
    return app;
};
