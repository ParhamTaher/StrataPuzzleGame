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


$( document ).ready(function() {
  getuserinfo();
});
