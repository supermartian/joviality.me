/*
 * app.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

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
            nextjump = '/index.html';
        } else {
            nextjump = '/index.html';
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
            }
        });
    };

    $('#registerdone').click(function(ev) {
        register(true);
    });

    $('#take-picture').closest('div.ui-input-text').hide();
    $('input[name=pic]').change(function(event) {
        var file = event.target.files[0];
        var fd = new FormData();
    });

    $('#triggerCamera').click(function(ev) {
        $('#take-picture').trigger('click');
    });
});
