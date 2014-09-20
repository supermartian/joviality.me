/*
 * users.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

'use strict';

require('./../models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.login = function(req, res) {
    var user = req.body;
    console.log(req.body);
    if (user == undefined || user.email == undefined || user.password == undefined) {
        res.status(500).jsonp({error: 'Error in request'});
        return;
    }

    User.findOne({email: user.email, password: user.password}).exec(function(err, user) {
        if (err) {
            return res.jsonp(500, {error: 'Error in finding users'});
        }

        if (user) {
            req.session.user = user;
            user.password = undefined;
            res.status(200).jsonp(user);
        } else {
            res.status(403).jsonp({error: 'Wrong email or password'});
        }
    });
};

exports.logout = function(req, res) {
    req.session.user = undefined;
};

exports.register = function(req, res) {
    var newuser = new User(req.body);
    User.find({email: req.body.email}).exec(function(err, user) {
        if (user.length > 0) {
            return res.jsonp(500, {error: 'Already has a user with the same email'});
        }

        newuser.save(function(err) {
            if (err) {
                console.log(err);
                return res.jsonp(500, {error: 'Cannot perform the registeration'});
            }

            // For the sake of safety
            newuser.password = undefined;
            res.jsonp(newuser);
        });
    });
};
