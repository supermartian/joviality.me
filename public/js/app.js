/*
 * app.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

var gallery = [];
var user = {};

function refreshPage(url) {
  $.mobile.changePage(
    url,
    {
      allowSamePageTransition : true,
      transition              : 'none',
      showLoadMsg             : false
    }
  );
};

$('.galleria').on('pagebeforeshow', function() {
});

$(document).on('pagebeforeshow', '#page-home', function() {
    var getUser = function() {
        $.ajax({
            type: "GET",
            url: "/user/"+$.cookie('user'),
            success: function(data) {
                user = data;

                var tree = new Branch({x:200, y:600}, {x:200, y:500});
                tree.thick = 0.4;
                tree.growLeaf(tree);
                for (var i = 0; i < user.faces.length; i++) {
                    for (var j = 0; j < user.faces[i].smileRate/10; j++) {
                        tree.grow(tree, true, true);
                    }
                }
                drawTree(tree);
            }
        });
    };

    getUser();
});

$(document).on('pagebeforeshow', function() {
    var login = function(mobile) {
        var nextjump;
        if (mobile) {
            nextjump = '#page-home';
        } else {
            nextjump = '/home.html';
        }

        $.ajax({
            type: "POST",
            url: "/user/login",
            data: {
                email: $('#email').val(),
                password: $('#password').val()
            },
            dataType: 'json',
            success: function(data) {
                $.mobile.navigate(nextjump);
                user = data;
                $.cookie('user', user._id);
            }
        });
    };

    $('#mobileLogin').click(function(ev) {
        login(true);
    });

    $('#login').click(function(ev) {
        login(false);
    });

    $('#register').click(function(ev) {
        $.mobile.navigate('/mobile/register.html');
    });

    var register = function(mobile) {
        var nextjump;
        if (mobile) {
            nextjump = '#page-home';
        } else {
            nextjump = '#page-home';
        }

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
                $.mobile.navigate(nextjump);
                $.cookie('user', data._id);
            }
        });
    };

    $('#registerdone').click(function(ev) {
        register(true);
    });

    var file;
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
                $.mobile.loading('hide');
                refreshPage('#page-home');
            }
        });
    });

    $('#triggerCamera').click(function(ev) {
        $('#take-picture').trigger('click');
    });

    $('#openGallery').click(function(ev) {
        Galleria.loadTheme('/js/galleria/themes/classic/galleria.classic.min.js');
        Galleria.run('.galleria', {
            dataSource: gallery
        });
    });
});
