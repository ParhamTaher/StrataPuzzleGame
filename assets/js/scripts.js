function superInit() {
    $('#back').click(back);
    $('#menu').click(toggleNav);
}

function toggleNav() {
	$("nav").toggleClass("nav-on");
}



function getuserinfo() {
	$.get('/userinfo', function(data){
		if (data) {
			if (data.username && data.verbose) {
				$($("#nav-pbrief").find("span")[0]).html(data.username);
				$($("#nav-pbrief").find("span")[1]).html(data.verbose);
			}
		}
	});
}