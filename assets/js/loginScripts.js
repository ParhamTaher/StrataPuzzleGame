$( document ).ready(function() {
    $('#login-btn').click(login);
    $('#register-btn').click(toggleRegister);
});

function login(){
	var $un = $("input[name=username]").val();
	var $pw = $("input[name=password]").val();
	if (!$un) {
		noti("Please enter username", "red");
		return;
	} else if (!$pw) {
		noti("Please enter password", "red");
		return;
	}

    $.post({
        url: "/login",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify( { username: $un, password: $pw } ),
        success: function(r) {
            noti("Login Success.", "green");
            setTimeout(function(){window.location.href = "./community";}, 500);
        },
        error: function (r) {
        	noti(r.responseText+". Please try again.", "red");
        }
    });
}

function toggleRegister() {
	var $btn1 = $("#login-btn");
	var $btn2 = $("#register-btn");
	var $cpw = $("input[name=cpassword]");

	if ($btn1.html() == 'Login') {
		$btn1.html('Register');
		$btn1.off("click").click(register);
		$btn2.html('Cancel');
		$cpw.removeClass("disabled");
	} else {
		$btn1.html('Login');
		$btn1.off("click").click(login);
		$btn2.html('Register');
		$cpw.addClass("disabled");
	}
}

function register() {
	var $un = $("input[name=username]").val();
	var $pw = $("input[name=password]").val();
	var $cpw = $("input[name=cpassword]").val();
	if (!$un) {
		noti("Please enter username", "red");
		return;
	} else if (!$pw) {
		noti("Please enter password", "red");
		return;
	} else if ($pw != $cpw) {
		noti("Confirm password does not match", "red");
		return;
	}

    $.post({
        url: "/register",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify( {	username: $un, password: $pw } ),
        success: function(r) {
            noti("Register Success.", "green");
            setTimeout(function(){window.location.href = "./community";}, 500);
        },
        error: function (r) {
        	noti(r.responseText+". Please try again.", "red");
        }
    });
}

// This function is adapted from my old work. Jack
var notifying = null;
function noti(what, colour, length) {
	clearTimeout(notifying);
	length = length || 3000;
	var $noti = $("#login-noti");
	$noti.find("span").html(what);
	$noti.attr('class', 'noti '+colour).css('height', $noti[0].scrollHeight+'px');
	notifying = setTimeout(function(){$noti.css('height', '0')}, length);
}