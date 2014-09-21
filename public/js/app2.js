/*
 * app2.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

var gallery = [];
var user = {};
var leaves = [];
var tree = new Branch({x:150, y:400}, {x:150, y:370});
tree.thick = 0.4;
tree.growLeaf(tree);

var img = new Image();
img.src = "/img/2.png";
leaves.push(img);
img = new Image();
img.src = "/img/2.png";
leaves.push(img);
img = new Image();
img.src = "/img/2.png";
leaves.push(img);

var cloud = new Image();
var hill = new Image();

cloud.src = "/img/cloud/" + Math.floor((Math.random() * 100)) % 5 + ".png";
hill.src = "/img/hill/" + Math.floor((Math.random() * 100)) % 5 + ".png";

var drawTree = function(context1, context2, tree) {
    console.log(context1);
    context1.beginPath();
    context1.moveTo(tree.start.x, tree.start.y);
    context1.quadraticCurveTo(tree.end.x, tree.end.y+40, tree.end.x, tree.end.y);
    context1.lineWidth = tree.thick;
    context1.stroke();

    for (var i = 0; i < tree.branches.length; i++) {
        drawTree(context1, context2, tree.branches[i]);
    }

    for (var i = 0; i < tree.leaves.length; i++) {
        context2.drawImage(leaves[tree.leaves[i].style], tree.leaves[i].x, tree.leaves[i].y, tree.leaves[i].scale * leaves[i].width, tree.leaves[i].scale * leaves[i].height);
    }
}


var render = function() {
    var canvas0 = document.getElementById('layer0');
    var context0 = canvas0.getContext('2d');
    var canvas1 = document.getElementById('layer1');
    var context1 = canvas1.getContext('2d');
    var canvas2 = document.getElementById('layer2');
    var context2 = canvas2.getContext('2d');

    context0.drawImage(cloud, 0, 0);
    context0.drawImage(hill, - Math.floor((Math.random() * 400)) % 100, 300, hill.width, hill.height);


    drawTree(context1, context2, tree);
};

function refreshPage(url) {
  $.mobile.changePage(
    url,
    {
      allowSamePageTransition : true,
      transition              : 'none',
      showLoadMsg             : false
    }
  );
}

$(document).on("pagebeforeshow","#page-login",function(){
    $("#mobileLogin").click(function() {
        $.ajax({
            type: "POST",
            url: "/user/login",
            data: {
                email: $('#email').val(),
                password: $('#password').val()
            },
            dataType: 'json',
            success: function(data) {
                user = data;
                $.cookie('user', user._id);
                $.mobile.navigate('#page-home');
            }
        });
    });
});

$(document).on("pagebeforeshow","#page-register",function(){
    $('#registerdone').click(function() {
        $.ajax({
            type: "POST",
            url: "/user/register",
            data: {
                email: $('#regemail').val(),
                password: $('#regpassword').val(),
                name: $('#regname').val()
            },
            dataType: 'json',
            success: function(data) {
                $.cookie('user', data._id);
                $.ajax({
                    type: "GET",
                    url: "/user/"+$.cookie('user'),
                    success: function(data) {
                        user = data;

                        tree = new Branch({x:150, y:400}, {x:150, y:370});
                        for (var i = 0; i < user.faces.length; i++) {
                            for (var j = 0; j < user.faces[i].smileRate/10; j++) {
                                tree.grow(tree, true, true);
                            }
                        }
                    }
                });
                $.mobile.navigate('#page-home');
            }
        });
    });
});

$(document).on("pagebeforeshow","#page-home",function(){
    console.log($.cookie('user'));
    $.ajax({
        type: "GET",
        url: "/user/"+$.cookie('user'),
        success: function(data) {
            user = data;

            tree = new Branch({x:150, y:400}, {x:150, y:370});
            for (var i = 0; i < user.faces.length; i++) {
                for (var j = 0; j < user.faces[i].smileRate/10; j++) {
                    tree.grow(tree, true, true);
                }
            }
            render();
        }
    });
    $('#take-picture').closest('div.ui-input-text').hide();
    $('#take-picture').change(function(event) {
        var files = event.target.files;
        var data = new FormData();
        $.each(files, function(key, value) {
            data.append(key, value);
        });
        $.mobile.loading('show');
        $.ajax({
            type: 'POST',
            url: '/face',
            data: data,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                var noti;
                if (data.smileRate < 10) {
                    noti = 'Don\'t be so sad!';
                } else if (data.smileRate < 50) {
                    noti = 'Be happier!';
                } else if (data.smileRate < 80) {
                    noti = 'Your smile shines!';
                } else if (data.smileRate < 100) {
                    noti = 'Oh man you have a real happy face!';
                } else {
                    noti = 'Cool! You even have some happy friends!';
                }

                alert(noti);
                $.mobile.loading('hide');
                refreshPage('#page-home');
            },
            error: function(xhr, status, err) {
                $.mobile.loading('hide');
            }
        });
    });

    $('#triggerCamera').click(function(ev) {
        $('#take-picture').trigger('click');
    });
});
