/*
 * desktop.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

var cloud = new Image();
var hill = new Image();
var faces = [];
$.ajax({
    type: "GET",
    url: "/user/all",
    success: function(data) {
        user = data;
        for (var i = 0; i < user.length; i++) {
            for (var j = 0; j < user[i].faces.length; j++) {
                faces.push(user[i].faces[j].fileId);
            }
        }
        console.log(faces);
    }
});

(function() {
    window.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        event = event || window.event; // IE-ism
        // event.clientX and event.clientY contain the mouse position
        var src = faces[Math.floor(Math.random() * 100) % faces.length];
        src = '/face/'+src;
        $('#avatar').attr("src", src);
    }
})();
