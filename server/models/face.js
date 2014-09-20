/*
 * face.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FaceSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    fileId: {
        type: String,
        required: true
    },
    smileRate: {
        type: Number,
        required: true
    }
});

mongoose.model('Face', FaceSchema);
