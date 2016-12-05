$(function(){
  $('#profiletabs ul li a').on('click', function(e){
    e.preventDefault();
    var newcontent = $(this).attr('href');

    $('#profiletabs ul li a').removeClass('sel');
    $(this).addClass('sel');

    $('#content section').each(function(){
      if(!$(this).hasClass('hidden')) { $(this).addClass('hidden'); }
    });

    $(newcontent).removeClass('hidden');
  });
});


function getuserinfo() {
  $.get('/userinfo', function(data){
    console.log(data);
    if (data) {
      if (data.username && data.verbose) {
        $("#username").html(data.username);
      }
    }

  });
}

function changePassword() {
  var pass = {Password: $("#newPass").val()};
  console.log(pass);
  $.ajax({
        type: 'POST',
        url: '/changepass',
        data: pass,
        success: function(callBack) {
            console.log(callBack);
        },
        error: function(callBack) {
            console.log(callBack);
        }
    });
}

function updateEmail() {
  var email = {Email: $("#newEmail").val()};
  console.log(email);
  $.ajax({
        type: 'POST',
        url: '/updateemail',
        data: email,
        success: function(callBack) {
            console.log(callBack);
        },
        error: function(callBack) {
            console.log(callBack);
        }
    });
}

function updateDescription() {
  var desc = {Description: $("#description").val()};
  console.log(desc);
  $.ajax({
        type: 'POST',
        url: '/updatedescription',
        data: desc,
        success: function(callBack) {
            console.log(callBack);
        },
        error: function(callBack) {
            console.log(callBack);
        }
    });
}


$( document ).ready(function() {
  getuserinfo();
  $("#changePass").click(changePassword);
  $("#updateEmail").click(updateEmail);
  $("#updateDescription").click(updateDescription);
  $("#logout").click(logout);
});

function logout () {
    $.get({
        url: '/logout',
        success: function(r) {
          window.location.href="mode.html";
        }
    });
}
